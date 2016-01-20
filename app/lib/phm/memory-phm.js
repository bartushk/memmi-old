var config = require('../../config/config-factory').getConfig();
var log = require('../log-factory').getLogger();
var memCsm = require("../csm/memory-csm");
var utils = require("./phm-utils");
var _ = require("underscore");


/**
 * Simple memory based Player History Manager (phm).
 * Mostly used while working out the site structure.
 *
 * @param {CardSetManager} csm
*/ 
function MemoryPhm(csm, initialData){
    this._playerHistory = initialData || {};
    this._csm = csm || new memCsm();
    if(config.mockData){
        this._playerHistory = require('../../test/assets/test-data').getFullHistory();
    }
}


/**
 * Gets a player's card set scoring history.
 *  
 * @param {string} cardSetId 
 * @param {Object} playerObj - {'playerId': 'kbart', 'isAnon': false} 
 * @param {Function} callback - callback(err, playerHistory)
 * @return {null}
 *
*/ 
MemoryPhm.prototype.getPlayerHistory = function(cardSetId, playerObj, callback){
    callback = callback || function(err, playerHistory){};
    var self = this;
    if(playerObj.isAnon){
        utils.getBlankHistory(this._csm, cardSetId, function(err, blankHistory){
            if(err){
                callback(err);
                return;
            }
            callback(null, blankHistory);
        });
        return;
    }

    var playerId = playerObj.playerId;

    if( !(playerId in this._playerHistory) ){
        this._playerHistory[playerId] = {};
    }

    if( !(cardSetId in this._playerHistory[playerId]) ){
        utils.getBlankHistory(this._csm, cardSetId, function(err, blankHistory){
            if(err){
                callback(err);
                return;
            }
            var historyCopy = JSON.parse(JSON.stringify(blankHistory));
            self._playerHistory[playerId][cardSetId] = blankHistory;
            callback(null, historyCopy);
        });
        return;
    }

    var historyCopy = JSON.parse(JSON.stringify(this._playerHistory[playerId][cardSetId]));
    callback(null, historyCopy);
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
MemoryPhm.prototype.updateCardScore = function(cardSetId, playerObj, cardUpdate, callback){
    callback = callback || function(err){};
    var playerId = playerObj.playerId;

    if( !(playerId in this._playerHistory) ){
        callback( new Error("Player doesn't exist in history.") );
        return;
    }

    if( !(cardSetId in this._playerHistory[playerId]) ){
        callback( new Error("Player has no history for this card set.") );
        return;
    }
    
    var history = this._playerHistory[playerId][cardSetId];
    var cardId = cardUpdate.cardId;
    if( !(cardId in history.history) ){
        callback( new Error("Card not found in Cardset.") );
        return;
    }
    var cardHistory = history.history[cardId];
    cardHistory.scores.push(cardUpdate.score);
    cardHistory.playIndicies.push(history._playIndex);
    cardHistory.currentScore += cardUpdate.score;
    history._playIndex+=1;
    callback(null);
};

/**
 * Creates a new player history object for a specfic cardset and player.
 *  
 * @param {string} cardSetId 
 * @param {Object} playerObj - {'playerId': 'kbart', 'isAnon': false} 
 * @param {Object} playerHistory 
 * @param {Function} callback - callback(err) 
 * @return {null}
 *
*/ 
MemoryPhm.prototype.createPlayerHistory = function(cardSetId, playerObj, callback){
    callback = callback || function(err){};
    var playerId = playerObj.playerId;
    if( !(playerId in this._playerHistory) ){
        this._playerHistory[playerId] = {};
    }
    var playerHistory = this._playerHistory[playerId];

    if( cardSetId in playerHistory ){
        callback(new Error("Card set already has a history."));
        return;
    }

    utils.getBlankHistory(this._csm, cardSetId, function(err, blankHistory){
        if(err){
            callback(err);
            return;
        }
        playerHistory[cardSetId] = blankHistory;
        callback(null);
    });
};

module.exports =  MemoryPhm;

