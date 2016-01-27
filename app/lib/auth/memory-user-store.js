var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();


/**
 * Simple in memory User Store. Temporary and used
 * almost excluisvely for development.
 *
*/ 
function MemoryUserStore(initialData){
    this._users = initialData || {};
    if(config.mockData){
        this._users = require('../../test/assets/test-data').getUserStore();
    }
}


/**
 * Gets the user data for someone by username.
 *  
 * @param {string} username 
 * @param {Function} callback - callback(err, userData)
 * @return {null}
 *
*/ 
MemoryUserStore.prototype.getUserData = function(username, callback){
    callback = callback || function(err, userData){};
    if( !(username in this._users) ){
        callback(new Error("User does not exist."), null);
        return;
    }
    var userCopy = JSON.parse(JSON.stringify(this._users[username]));
    callback(null, userCopy); 
};


/**
 * Checks if a particular user exists.
 *
 * @param {string} username
 * @param {Function} callback - callback(err, res)
 * @return {Boolean}
 *
*/ 
MemoryUserStore.prototype.exists = function(username, callback){
    callback = callback || function(err, res){};
    callback(null, username in this._users);
};



module.exports = MemoryUserStore;
