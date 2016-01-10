var bun = require('bunyan');
var log = bun.createLogger({name: 'memmi'});
var _ = require('underscore');

module.exports.setLogLevel = function(level){
    _.each(log.streams, function(stream){
        stream.level = 0;
    });
};

module.exports.getLogger = function(){
    return log;
};
