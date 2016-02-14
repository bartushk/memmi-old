var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();
var utils = require("./phm-utils");
var defaultCsm = require('../csm/csm-factory').getCsm();
var mongoClient = require('mongodb').MongoClient;


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
    this._writeConcern = {w:1};
}

/**
 * Helper function for querying based on cardSetId and playerObj.
 * Returns a mongo query object for finding a history.
 *
 * @param {string} playerId
 * @param {string} cardSetId 
 * @return {Object} 
*/ 
MongoPhm.prototype._getQuery = function(playerId, cardSetId){
    var query = { metaInfo: {playerId: playerId, cardSetId: cardSetId} };
    return query;
};

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
    if( playerObj.isAnon ){
        utils.getBlankHistory(this._csm, cardSetId, function(err, blankHistory){
            if(err){
                callback(err);
                return;
            }
            callback(null, blankHistory);
        });
        return;
    }
    this._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var col = db.collection(self._collection);
        var query = self._getQuery(playerObj.playerId, cardSetId);
        col.findOne(query, {_id: 0}, function(err, history){
            if(err){
                db.close();
                return;
            }
            if( !history ){
                self.createPlayerHistory(cardSetId, playerObj, callback); 
                return;
            }
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
    var self = this;
    var playerId = playerObj.playerId;

    if(playerObj.isAnon){
       callback(null);
       return;
    }

    this._connect(function(err, db){
        var col = db.collection(self._collection);
        var query = self._getQuery(playerObj.playerId, cardSetId);
        var scoresProp = cardId + '.scores';
        var currentScoreProp = cardId + '.currentScore';
        var playIndiciesProp = cardId + '.playIndicies';
        var update = {
            $push: { playIndiciesProp: cardUpdate.play_index, scoresProp: cardUpdate.score },
            $inc: { _playIndex: 1, currentScoreProp: cardUpate.score },
        };
        col.updateOne(query, update, self._writeConcern).then(function(result){
            db.close();
            if(result.result.n != 1){
                callback(new Error("Update result came back as wrong ammount: " + result.result.n));
                return;
            }
            callback(null);
        });
    });
};

/**
 * Creates a new player history object for a specfic cardset and player.
 * Returns an error if a history already exists for the player and cardset.
 *  
 * @param {string} cardSetId 
 * @param {Object} playerObj - {'playerId': 'kbart', 'isAnon': false} 
 * @param {Object} playerHistory 
 * @param {Function} callback - callback(err, createdHistory) 
 * @return {null}
 *
*/ 
MongoPhm.prototype.createPlayerHistory = function(cardSetId, playerObj, callback){
    callback = callback || function(err){};
    var self = this;
    if(playerObj.isAnon){
        callback(new Error("Cannot create a history for an anonymous player."));
        return;
    }
    this._connect(function(err, db){
        var col = db.collection(self._collection); 
        var query = self._getQuery(playerObj.playerId, cardSetId);
        col.find(query).limit(1).toArray(function(err, result){
            if(err){
                callback(err);
                db.close();
                return;
            }
            if( result.length > 0 ){
                callback(new Error("Cardset already has a history for this player."));
                db.close();
                return;
            }
            utils.getBlankHistory(self._csm, cardSetId, function(err, blankHistory){
                if(err){
                    callback(err);
                    db.close();
                    return;
                }
                blankHistory.metaInfo = {'playerId': playerObj.playerId, 'cardSetId': cardSetId};
                col.insertOne(blankHistory, self._writeConcern, function(err, result){
                    db.close();
                    callback(err, blankHistory);
                });
            });
        });
    });
};

module.exports = MongoPhm;
