var config = require('../../config/config-factory').getConfig();
var memPhm = require('./memory-phm');
var conPhm = require('./' + config.phm);
var csm = require('../csm/csm-factory').getCsm();

var configuredPhm = new conPhm(csm);

// Initialize data if to test data if the app is configured to mock data.
if(config.mockData && config.phm == 'memory-phm'){
    configuredPhm = new memPhm(csm, require('../../test/assets/test-data').getFullHistory());
}


/**
 * Gets a phm based on the current configuration. 
 *
 * @return {MemoryPhm}
*/ 
module.exports.getPhm = function(){
    return configuredPhm;
};
