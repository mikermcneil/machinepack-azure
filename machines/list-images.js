module.exports = {
  friendlyName: 'List images',
  description: 'List all the virtual machine images available to a particular account.',
  extendedDescription: '',
  inputs: {
    subscriptionId: {
      friendlyName: 'Subscription ID',
      description: 'Your Windows Azure subscription id',
      example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx',
      whereToGet: {
        url: 'https://account.windowsazure.com/Subscriptions/Statement?subscriptionId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx'
      },
      required: true
    },
    certificate: {
      friendlyName: 'Management certificate',
      description: 'The string contents of a management certificate (.pem file) associated with your Azure account',
      example: '-----BEGIN CERTIFICATE-----\nxxxxxxxxxxxx\nxxxxxxxxxxxx\nxxxxxxxxxxxx\n........\nxxxxxxxxxxxx\n-----END CERTIFICATE-----',
      whereToGet: {
        description: 'Download or generate the `.pem` certificate file associated with your Azure account.',
        extendedDescription: 'For info on generating a new certificate file, see http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-ssh-key/.  An easy way to grab your existing certificate file is to install the Azure CLI tool with `sudo npm install -g azure-cli` (https://github.com/Azure/azure-xplat-cli) and run `azure account cert export`.  To make the command-line tool work, you\'ll need to follow the directions to set up an organizational account here: http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/.  Note that the uploaded certificate is in `.cer` format, but you should use the `.pem` version here.',
        url: 'https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/computeManagement#authentication'
      },
      required: true
    },
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    forbidden: {
      description: 'The provided subscription id and/or certificate are invalid, incorrect, or do not correspond to the same Azure account.',
      extendedDescription: 'The server failed to authenticate the request. Verify that the certificate is valid and is associated with this subscription.'
    },
    success: {
      description: 'Done.',
      // example: ['server id']
    }
  },
  fn: function(inputs, exits) {

    var _ = require('lodash');
    var AzureCompute = require('azure-mgmt-compute');

    var azureClient = AzureCompute.createComputeManagementClient(AzureCompute.createCertificateCloudCredentials({
      subscriptionId: inputs.subscriptionId,
      pem: inputs.certificate
    }));

    azureClient.virtualMachineOSImages.list(function (err, result) {
      if (err) {
        if (!_.isObject(err)) return exits.error(err);
        if (err.code === 'ForbiddenError') {
          return exits.forbidden(err);
        }
        // console.log(err.code,err.type,err.name,err);
        return exits.error(err);
      }

      return exits.success(result);
    });

  },

};
