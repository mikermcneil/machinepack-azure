module.exports = {

  friendlyName: 'Create Website',
  description: 'Creates an Azure Website Instance',
  extendedDescription: '',

  inputs: {},
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
    var readline = require('readline');
    var cliPath = require('path').resolve(__dirname, '../node_modules/azure-cli/bin/azure');
    var uuid = require('uuid');
      var defaults, command;

      defaults = {
          name: uuid.v4(),
          location: 'West US',
          hostname: null
      };

      _.defaults(inputs, defaults);

      command = 'azure site create --location "' + inputs.location + '" "' + inputs.name + '"';

      child_process.exec(command, function (err, stdout) {

          if (err) {
              return exists.error(err);
          }

          return exists.success(stdout);
      });
    },

};
