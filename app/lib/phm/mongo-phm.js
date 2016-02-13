var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();
var utils = require("./phm-utils");
var defaultCsm = require('../csm/csm-factory').getCsm();
var mon = require('mongodb');
var mongoClient = mon.MongoClient;
var objId = mon.ObjectID;




/**
 * Mongodb based Player History Manager (phm).
 * Stores and retrieves information about a player's
 * rankings during play.
 *
 * @param {CardSetManager} csm 
*/ 
function MongoPhm(csm){
    this._csm = csm || defaultCsm;
    this._url = config.mongo.url;
    this._collection = config.mongo.historyCollection;
}


/**
 * Private function used for getting a mongo connection.
 *
 * @param {Function} callback - callback(err, db)
 * @return {null}
 *
*/ 
MongoPhm.prototype._connect = function(callback){
    mongoClient.connect(this._url, function(err, db){
        if(err){
            log.error("Cannot connect to mongodb", err);
        }
        callback(err, db);
    });
};

/**
 * Gets a player's card set scoring history.
 *  
 * @param {string} cardSetId 
 * @param {Object} playerObj - {'playerId': 'kbart', 'isAnon': false} 
 * @param {Function} callback - callback(err, playerHistory)
 * @return {null}
 *
*/ 
MongoPhm.prototype.getPlayerHistory = function(cardSetId, playerObj, callback){
    callback = callback || function(err, playerHistory){};
    var self = this;
    this._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var col = db.collection(self._collection);
        var query = {};
        query._id = new objId(cardSetId + playerObj.playerId);
        col.findOne(query, null, function(err, history){
            callback(err, history);
            db.close();
        });
    });
};


/**
 * Updates a player's card scoring history by applying a cardUpdate object.
 *  
 * @param {string} cardSetId 
 * @param {Object} playerObj - {'playerId': 'kbart', 'isAnon': false} 
 * @param {Object} cardUpdate 
 * @param {Function} callback - callback(err) 
 * @return {null}
 *
*/ 
MongoPhm.prototype.updateCardScore = function(cardSetId, playerObj, cardUpdate, callback){
    callback = callback || function(err){};
    var playerId = playerObj.playerId;

    if(playerObj.isAnon){
       callback(null);
       return;
    }

    this._connect(function(err,db){
        var col = db.collection(self._collection);
    });
};


module.exports = MongoPhm;
