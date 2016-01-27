var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();


/**
 * Identity provider that checks for a client-sessions cookie
 * specified by the configuration.
 *
*/ 
function ClientIdentityProvider(){
    this._cookieName = config.sessionName;
}


/**
 * Checks for a client-sessions cookie and returns an anon
 * Id if one is not found.
 *  
 * @param {HttpRequest} req 
 * @param {Function} callback 
 * @return {none}
 *
*/ 
ClientIdentityProvider.prototype.getIdentity = function(req, callback){
    if(!(this._cookieName in req) ){
        callback(null, {'playerId': 'Anon', 'isAnon': true});
        return;
    }
    var identity = req[this._cookieName];
    log.debug(identity, "Identity retreived.");
    identity.isAnon = !identity.playerId;
    callback(null, identity);
};


module.exports = ClientIdentityProvider;
