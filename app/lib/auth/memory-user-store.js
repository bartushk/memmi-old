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
 * Gets the user data for someone by playerId.
 *  
 * @param {string} playerId 
 * @param {Function} callback - callback(err, userData)
 * @return {null}
 *
*/ 
MemoryUserStore.prototype.getUserData = function(playerId, callback){
    callback = callback || function(err, userData){};
    if( !(playerId in this._users) ){
        callback(new Error("User does not exist."), null);
        return;
    }
    var userCopy = JSON.parse(JSON.stringify(this._users[playerId]));
    callback(null, userCopy); 
};


/**
 * Adds a user object to the user store.
 *  
 * @param {Object} userObj 
 * @param {Function} callback - callback(err, userObj)
 * @return {null}
 *
*/ 
MemoryUserStore.prototype.addUser = function(userObj, callback){
    callback = callback || function(err, userData){};
    if( playerId in this._users ){
        callback(new Error("User already exists."), null);
        return;
    }
    this._users[userObj.playerId] = JSON.parse(JSON.stringify(userObj));
    callback(null, JSON.parse(JSON.stringify(userObj)));
};


module.exports = MemoryUserStore;
