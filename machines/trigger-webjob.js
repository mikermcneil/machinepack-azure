module.exports = {

  friendlyName: 'Trigger Webjob',
  description: 'Triggers a webjob on a given website.',
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
      description: 'The name of the script that should be triggered',
      example: 'myscript.ps1',
      required: true
    },
    website: {
      description: 'The name of the website the script should be triggered on',
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

    var targetUrl = 'https://' + inputs.website + '.scm.azurewebsites.net/api/triggeredwebjobs/' + inputs.name + '/run';

    request.post(targetUrl, {
      'auth': {
        'user': inputs.deploymentUser,
        'pass': inputs.deploymentPassword
      }
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
  },
};
