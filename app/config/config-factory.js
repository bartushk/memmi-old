var configName = process.env.CONFIG || "test-basic";
var config = require('./' + configName + '-config');  

//Session default config checking.
config.sessionName = config.sessionName ? config.sessionName : "memmi_session";
config.sessionSecret = process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "Not so secret :D";
config.sessionDuration = config.sessionDuration ? config.sessionDuration : 24 * 60 * 60 * 1000 * 7;
config.sessionRefresh = config.sessionRefresh ? config.sessionRefresh : 24 * 60 * 60 * 1000 * 7;

//Default log level
config.logLevel = config.logLevel ? config.logLevel : 'info';

//Default card set manager
config.csm = config.csm ? config.csm : 'memory-csm'; 

//Default player history manager
config.phm = config.phm ? config.phm : 'memory-phm';

//Default identity provider
config.identityProvider = config.identityProvider ? config.identityProvider : 'client-identity-provider';

//Make sure these values are true/false
config.mockData = !!config.mockData;
config.multiProcess = !!config.multiProcess;

//Set default port to 3000 for development.
config.port = config.port ? config.port : 3000;

//Set default mongo configuration.
config.mongo = config.mongo ? config.mongo : {};
config.mongo.url = config.mongo.url ? config.mongo.url : 'mongodb://localhost:27017';
config.mongo.historyCollection = config.mongo.historyCollection ? config.mongo.historyCollection : 'player_history';
config.mongo.userCollection = config.mongo.userCollection ? config.mongo.userCollection : 'user';
config.mongo.cardSetCollection = config.mongo.cardSetCollection ? config.mongo.cardSetCollection : 'card_set';

module.exports.getConfig = function(){
    return config;
};
