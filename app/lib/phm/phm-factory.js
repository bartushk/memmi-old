var config = require('../../config/config-factory').getConfig();
var memPhm = require('./memory-phm');
var conPhm = require('./' + (config.phm || 'memory-phm'));
var csm = require('../csm/csm-factory').getCsm();

var configuredPhm = new conPhm(csm);

if(config.mockData){
    configuredPhm = new memPhm(csm, require('../../test/assets/test-data').getFullCardSet());
}


/**
 * Gets a phm based on the current configuration. 
 *
 * @return {MemoryPhm}
*/ 
module.exports.getPhm = function(){
    return configuredPhm;
};
