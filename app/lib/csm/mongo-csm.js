var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();



/**
 * Mongo based Card Set Manager. (csm)
 * Stores and retrieves player saved card sets.
 *
*/ 
function MongoCsm(){
    this._url = config.mongo.url;
    this._collection = config.mongo.cardSetCollection;
    //TODO: add deactivated collection to config
    //TODO: add write_options to config (also used in mongo-phm)
    this._writeOptions = {w:1};
}


/**
 * Helper function for querying based on cardSetId.
 * Returns a mongo query object for finding a history.
 *
 * @param {string} cardSetId 
 * @return {Object} 
*/ 
MongoCsm.prototype._getQuery = function(cardSetId){
    var query = { };
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
    var _callback = callback || function(){};
    var self = this;
    self._connect(function(err, db){
        if(err){
            callback(err);
            return;
        }
        var query = self._getQuery(cardSet.id);
        var col = db.collection(self._collection);
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
                callback(err, cardSet);
            });
        });
    });
};


module.exports = MongoCsm;
