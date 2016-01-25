var config = require('../../config/config-factory').getConfig();
var conUserStore = require('./' + (config.userStore || 'memory-user-store'));

var conStore = new conUserStore();


module.exports.getUserStore = function(){
    return conStore;    
};
