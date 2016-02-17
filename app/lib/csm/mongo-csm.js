var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();
var mongoClient = require('mongodb').MongoClient;



/**
 * Mongo based Card Set Manager. (csm)
 * Stores and retrieves player saved card sets.
 *
*/ 
function MongoCsm(){
    this._url = config.mongo.url;
    this._activeCollection = config.mongo.cardSetCollection;
    this._inactiveCollection = config.mongo.inactiveCardSetCollection;
    this._writeOptions = config.mongo.writeOptions;
}


/**
 * Helper function for querying based on cardSetId.
 * Returns a mongo query object for finding a history.
 *
 * @param {string} cardSetId 
 * @return {Object} 
*/ 
MongoCsm.prototype._getQuery = function(cardSetId){
    var query = {};
    query.id = cardSetId;
    return query;
};


/**
 * Private function used for getting a mongo connection.
 *
 * @param {Function} callback - callback(err, db)
 * @return {null}
 *
*/ 
MongoCsm.prototype._connect = function(callback){
    mongoClient.connect(this._url, function(err, db){
        if(err){
            log.error("Cannot connect to mongodb", err);
        }
        callback(err, db);
    });
};


/**
 * Makes a new cardset available for use.ation simply puts the object
 *
 * @param {Object} cardSet
 * @param {Function} callback - callback(err, addedCardset)
 * @return {null}
*/ 
MongoCsm.prototype.addCardSet = function(cardSet, callback){
    callback = callback || function(){};
    var self = this;
    self._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var query = self._getQuery(cardSet.id);
        var col = db.collection(self._activeCollection);
        col.find(query).limit(1).toArray(function(err, result){
            if(err){
                callback(err);
                db.close();
                return;
            }
            if( result.length > 0 ){
                callback(new Error("Cardset already exists."));
                db.close();
                return;
            }
            col.insertOne(cardSet, self._writeOptions, function(err, result){
                db.close();
                var returnCopy = JSON.parse(JSON.stringify(cardSet)); 
                delete returnCopy._id;
                callback(err, returnCopy); 
            });
        });
    });
};


/**
 * Gets a cardset with only its Id.
 *
 * @param {string} cardSetId
 * @param {Function} callback - callback(err, cardSet)
 * @return {null}
*/ 
MongoCsm.prototype.getCardSetById = function(cardSetId, callback){
    callback = callback || function(){};
    var self = this;
    self._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var query = self._getQuery(cardSetId);
        var col = db.collection(self._activeCollection);
        col.findOne(query, {_id:0}, function(err, result){
            db.close();
            if(err){
                callback(err);
                return;
            }
            if(!result){
                callback(new Error("Card set was not found"));
                return;
            }
            callback(null, result);
        });
    });
};


module.exports = MongoCsm;
