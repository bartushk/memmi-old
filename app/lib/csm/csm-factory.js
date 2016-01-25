var config = require('../../config/config-factory').getConfig();
var memCsm = require('./memory-csm');
var conCsm = require('./' + (config.csm || 'memory-csm'));

var configuredCsm = new conCsm();

if(config.mockData){
    configuredCsm = new memCsm(null, require('../../test/assets/test-data').getFullCardSet());
}

/**
 * Gets a csm based on the current configuration. 
 *
 * @return {MemoryCsm}
*/ 
module.exports.getCsm = function(){
    return configuredCsm;
};
