
/**
 * Fake identity provider, returns what is passed to the constructor
 * placed into an identity object.
 * @param {string} username
 *
*/ 
function MockIdentityProvider(username, isAnon){
    this._username = username || "kyle";
    this._isAnon = !!isAnon;
}


/**
 * Gets the identity of a user by taking a request object and passing the
 * resulting identity object to a callback.
 *  
 * @param {HttpRequest} req 
 * @param {Function} callback - callback(err, identity)
 * @return {none}
 *
*/ 
MockIdentityProvider.prototype.getIdentity = function(req, callback){
    var identityObject = {};
    identityObject.playerId = this._username;
    identityObject.isAnon = this._isAnon;
    callback(null, identityObject);
};

module.exports = MockIdentityProvider;
