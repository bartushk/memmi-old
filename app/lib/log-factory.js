var config = require('../config/config-factory').getConfig();
var bun = require('bunyan');
var log = bun.createLogger({name: 'memmi'});
log.level(config.logLevel);

module.exports.getLogger = function(){
    return log;
};
