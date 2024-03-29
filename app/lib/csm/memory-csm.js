var config = require('../../config/config-factory').getConfig();
var _ = require('underscore');



/**
 * Simple memory based Card Set Manager (csm).
 * Mostly used while working out the site structure 
 * and during unit tests.
 *
*/ 
function MemoryCsm(initialData){
    this._data = initialData || {};
    this._inactiveSets = {};
}


/**
 * Makes a new cardset available for use. This implementation simply puts the object
 * into the _data dictionary. 
 *
 * @param {Object} cardSet
 * @param {Function} callback - callback(err, addedCardset)
 * @return {null}
*/ 
MemoryCsm.prototype.addCardSet = function(cardSet, callback){
    callback = callback || function(){};
    if(cardSet.id in this._data){
        callback(new Error("Card set already exists, please create a new one."), cardSet);
        return;
    }

    this._data[cardSet.id] = cardSet;
    callback(null, cardSet);
};


/**
 * Deactivates a cardset given only its Id.
 * This moves the specified cardset to the _inactiveSets dictionary.
 *
 * @param {string} cardSetId
 * @param {Function} callback - callback(err, deCardset) 
 * @return {null}
*/ 
MemoryCsm.prototype.deactivateCardSetById = function(cardSetId, callback){
    callback = callback || function(){};
    if(!(cardSetId in this._data)){
        callback(new Error("Card set did not exist, and could not be deactivated"));
        return;
    }
    var cardSet = this._data[cardSetId];
    cardSet._inactiveDate = new Date();
    if(!(cardSetId in this._inactiveSets)){
        this._inactiveSets[cardSet.id] = [];
    }
    this._inactiveSets[cardSetId].push(cardSet);
    delete this._data[cardSetId];
    callback(null, cardSetId);
};


/**
 * Gets a cardset with only its Id.
 *
 * @param {string} cardSetId
 * @param {Function} callback - callback(err, cardSet)
 * @return {null}
*/ 
MemoryCsm.prototype.getCardSetById = function(cardSetId, callback){
    callback = callback || function(){};
    if(!(cardSetId in this._data)){
        callback(new Error("Card set did not exist, and could not be fetched"));
        return;
    }
    var cardSet = this._data[cardSetId];
    callback(null, cardSet);
};


module.exports = MemoryCsm;
