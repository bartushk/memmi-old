var configName = process.env.CONFIG || "test";
var config = require('./' + configName + '-config');  

config.sessionName = config.sessionName ? config.sessionName : "memmi_session";

module.exports.getConfig = function(){
    return config;
};
