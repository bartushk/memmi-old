var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();
var mongoClient = require('mongodb').MongoClient;


/**
 * Simple in memory User Store. Temporary and used
 * almost excluisvely for development.
 *
*/ 
function MongoUserStore(){
    this._url = config.mongo.url;   
    this._collection = config.mongo.userCollection;
    this._writeOptions = config.mongo.writeOptions;
}


/**
 * Helper function for querying based on playerId.
 * Returns a query for a user data object.
 *
 * @param {string} playerId 
 * @return {Object} 
*/ 
MongoUserStore.prototype._getQuery = function(playerId){
    var query = {};
    query.playerId = playerId;
    return query;
};


/**
 * Private function used for getting a mongo connection.
 *
 * @param {Function} callback - callback(err, db)
 * @return {null}
 *
*/ 
MongoUserStore.prototype._connect = function(callback){
    mongoClient.connect(this._url, function(err, db){
        if(err){
            log.error("Cannot connect to mongodb", err);
        }
        callback(err, db);
    });
};


/**
 * Gets the user data for someone by playerId.
 *  
 * @param {string} playerId 
 * @param {Function} callback - callback(err, userData)
 * @return {null}
 *
*/ 
MongoUserStore.prototype.getUserData = function(playerId, callback){
    callback = callback || function(err, userData){};
    var self = this; 
    self._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var query = self._getQuery(playerId);
        var col = db.collection(self._collection);
        col.findOne(query, {_id: 0}, function(err, result){
            db.close();
            if(err){
                callback(err);
                return;
            }
            if(!result){
                callback(new Error("User was not found."));
                return;
            }
            callback(null, result);
        });
    });
};


/**
 * Adds a user object to the user store.
 *  
 * @param {Object} userObj 
 * @param {Function} callback - callback(err, userObj)
 * @return {null}
 *
*/ 
MongoUserStore.prototype.addUser = function(userObj, callback){
    callback = callback || function(err, userData){};
    var self = this; 
    self._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var query = self._getQuery(userObj.playerId);
        var col = db.collection(self._collection);
        col.find(query).limit(1).toArray(function(err, result){
            if(err){
                callback(err);
                db.close();
                return;
            }
            if( result.length > 0 ){
                callback(new Error("User with that playerId already exists."));
                db.close();
                return;
            }
            col.insertOne(userObj, self._writeOptions, function(err, result){
                delete userObj._id;
                var userCopy = JSON.parse(JSON.stringify(userObj));
                callback(err, userCopy);
            });
        });
    });
};

module.exports = MongoUserStore;
