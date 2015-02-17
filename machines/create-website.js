module.exports = {

  friendlyName: 'Create Website',
  description: 'Creates an Azure Website Instance',
  extendedDescription: '',
  
  inputs: {
    name: {
      description: 'The name for the website',
      example: 'mywebsite',
      required: false
    },
    location: {
      description: 'The Azure datacenter for the website',
      example: 'West US',
      required: false
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
    var _ = require('lodash');
    var child_process = require('child_process');
    var cliPath = require('path').resolve(__dirname, '../node_modules/azure-cli/bin/azure');
    var uuid = require('uuid');
    var defaults, command;

    defaults = {
      name: uuid.v4(),
      location: 'West US',
    };

    _.defaults(inputs, defaults);

    command = 'azure site create --location "' + inputs.location + '" "' + inputs.name + '"';

    child_process.exec(command, function (err, stdout) {
      if (err) {
          return exits.error(err);
      }
      return exits.success(stdout);
    });
  }
};
