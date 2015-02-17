module.exports = {

  friendlyName: 'Latest Log Webjob',
  description: 'Gets the latest log from a webjob on a given website.',
  extendedDescription: '',

  inputs: {
    deploymentUser: {
      description: 'The deployment username for the website',
      example: 'johndoe',
      required: true
    },
    deploymentPassword: {
      description: 'The deployment password for the website',
      example: 'p@ssw0rd',
      required: true
    },
    name: {
      description: 'The name of the script for which info should be requested',
      example: 'myscript.ps1',
      required: true
    },
    website: {
      description: 'The name of the website the script lives on',
      example: 'mysite',
      required: true
    }
  },

  defaultExit: 'success',
  exits: { 
    error: { 
      description: 'Unexpected error occurred.' 
    },
    success: { 
      description: 'Done.' 
    } 
  },

  fn: function (inputs,exits) {

    var child_process = require('child_process');
    var cliPath = require('path').resolve(__dirname, '../node_modules/azure-cli/bin/azure');
    var _ = require('lodash');
    var request = require('request');

    var checkForError = function (response) {
      response = (response[0] && response[0].headers) ? response[0] : response;

      if (response.headers && response.headers['content-type'] && response.headers['content-type'] === 'text/html') {
        // 'Azure returned text/html (which it shouldn't), checking for errors
        if (response.body && response.body.indexOf('401 - Unauthorized') > -1) {
          return 'Invalid Credentials: The Azure Website rejected the given username or password.';
        }
      }

      return false;
    }

    var targetUrl = 'https://' + inputs.website + '.scm.azurewebsites.net/api/triggeredwebjobs/' + inputs.name;

    request.get(targetUrl, {
      'auth': {
        'user': inputs.deploymentUser,
        'pass': inputs.deploymentPassword
      },
    },
    function (err, result) {
      if (err) {
        return exits.error(err);
      }

      errorCheck = checkForError(result);
      if (errorCheck) {
        return exits.error(errorCheck);
      }

      var responseBody, updaterScriptLog, updaterScriptRunning;

      if (result && result.statusCode === 200) {
        responseBody = JSON.parse(result.body);
        updaterScriptLog = (responseBody.latest_run && responseBody.latest_run.output_url) ? responseBody.latest_run.output_url : '';
        updaterScriptRunning = (updaterScriptLog) ? true : false;
      } else {
        return exits.error('No 200, got %d and body: %s', result.statusCode, result.body);
      }

      request.get(updaterScriptLog, {
        'auth': {
          'user': inputs.deploymentUser,
          'pass': inputs.deploymentPassword
        },
      },
      function (err, result) {
        if (err) {
          return exits.error(err);
        }

        errorCheck = checkForError(result);
        if (errorCheck) {
          return exits.error(errorCheck);
        }

        return exits.success(result);
      });
    });
  },
};
