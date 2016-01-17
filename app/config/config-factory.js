var configName = process.env.CONFIG || "test";
var config = require('./' + configName + '-config');  

module.exports.getConfig = function(){
    return config;
};
