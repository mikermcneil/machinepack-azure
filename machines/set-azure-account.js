module.exports = {
  friendlyName: 'Set Azure Account',
  description: 'Sets the active azure subscription',
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
    var child_process = require('child_process');
    var inquirer = require('inquirer');
    var readline = require('readline');
    var cliPath = require('path').resolve(__dirname, '../node_modules/azure-cli/bin/azure');

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    var command;

    command = 'node ' + cliPath + ' account list ';
    child_process.exec(command, function (err, stdout) {

      var accounts = stdout.split('\n');

      console.dir(accounts);

      inquirer.prompt({message: 'Please select the subscription to use', type:'question', choices: accounts,
        name: 'subscription'},
        function(answers){

          console.log('SELECETED ' + answers);
          exits.success();
        });
    });
  },

};
