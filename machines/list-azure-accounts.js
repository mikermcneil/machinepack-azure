module.exports = {
  friendlyName: 'Sets Site Deployment Credentials',
  description: 'Sets the deployment credntials of an Azure website',
  
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

    var cliPath = require('path').resolve(__dirname, '../node_modules/azure-cli/bin/azure');
    var scripty = require('azure-scripty');
    
    var command = {
      cmd: 'account list'
    };

    scripty.invoke(command, function (err, subscriptions) {

      if(err){
        return exits.error(err);
      }

      var output = [];
      for(var i in subscriptions){
        output.push({
          id: subscriptions[i].id,
          name: subscriptions[i].name
        });
      }

      return exits.success(output);
    });

  }

};
