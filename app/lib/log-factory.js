var bun = require('bunyan');
var log = bun.createLogger({name: 'memmi'});


module.exports.getLogger = function(){
    return log;
};
