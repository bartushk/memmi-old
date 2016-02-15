var config = require('../../config/config-factory').getConfig();
var memCsm = require('./memory-csm');
var conCsm = require('./' + config.csm);

var configuredCsm = new conCsm();

// Initialize data if to test data if the app is configured to mock data.
if(config.mockData && config.csm == 'memory-csm'){
    configuredCsm = new memCsm(require('../../test/assets/test-data').getFullCardSet());
}

/**
 * Gets a csm based on the current configuration. 
 *
 * @return {MemoryCsm}
*/ 
module.exports.getCsm = function(){
    return configuredCsm;
};
