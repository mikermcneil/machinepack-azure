module.exports = {
  friendlyName: 'Sets Site Deployment Credentials',
  description: 'Sets the deployment credntials of an Azure website',
  
  extendedDescription: '',
  inputs: {
    deploymentUser: {
      description: 'The Name of the User',
      example: 'johndoe',
      required: true
    },
    deploymentPassword: {
      description: 'The deployment password',
      example: 'p@ssword',
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

    var command = 'node ' + cliPath + ' site deployment user set ' + inputs.deploymentUser + ' ' + inputs.deploymentPassword;
    child_process.exec(command, function (err, stdout) {

      if(err){
        return exits.error(err);
      }

      return exits.success();
    });

  }

};
