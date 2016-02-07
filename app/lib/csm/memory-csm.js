var config = require('../../config/config-factory').getConfig();
var _cardSetValidator = require('../validators/card-set-AT');
var _ = require('underscore');



/**
 * Simple memory based Card Set Manager (csm).
 * Mostly used while working out the site structure 
 * and during unit tests.
 *
 * @param {cardSetValidator} cardSetValidator
*/ 
function MemoryCsm(cardSetValidator, initialData){
    this._data = initialData || {};
    this._inactiveSets = {};
    this.cardSetValidator = cardSetValidator || new _cardSetValidator();
}


/**
 * Makes a new cardset available for use. This implementation simply puts the object
 * into the _data dictionary after validating it.
 *
 * @param {Object} cardSet
 * @param {Function} callback - callback(err, addedCardset)
 * @return {null}
*/ 
MemoryCsm.prototype.addCardSet = function(cardSet, callback){
    var _callback = callback || function(){};
    var validationResult = this.cardSetValidator.validate(cardSet);
    if(validationResult != this.cardSetValidator.ok){
        _callback(new Error("Card set did not validate"), cardSet);
        return;
    }
    if(cardSet.id in this._data){
        _callback(new Error("Card set already exists, please create a new one."), cardSet);
        return;
    }
    cardSet._addedDate = new Date();
    this._data[cardSet.id] = cardSet;
    _callback(null, cardSet);
};


/**
 * Makes a cardset no longer available for use.
 * This moves the specified cardset to the _inactiveSets dictionary.
 *
 * @param {Object} cardSet
 * @param {Function} callback - callback(err, deCardset) 
 * @return {null}
*/ 
MemoryCsm.prototype.deactivateCardSet = function(cardSet, callback){
    var _callback = callback || function(){};
    var validationResult = this.cardSetValidator.validate(cardSet);
    if(validationResult != this.cardSetValidator.ok){
        _callback(new Error("Card set did not validate"), cardSet);
        return;
    }
    if(!(cardSet.id in this._data)){
        _callback(new Error("Card set did not exist, and could not be deactivated"));
        return;
    }
    cardSet._inactiveDate = new Date();
    if(!(cardSet.id in this._inactiveSets)){
        this._inactiveSets[cardSet.id] = [];
    }
    this._inactiveSets[cardSet.id].push(cardSet);
    delete this._data[cardSet.id];
    _callback(null, cardSet);
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
    var _callback = callback || function(){};
    if(!(cardSetId in this._data)){
        _callback(new Error("Card set did not exist, and could not be deactivated"));
        return;
    }
    var cardSet = this._data[cardSetId];
    cardSet._inactiveDate = new Date();
    if(!(cardSetId in this._inactiveSets)){
        this._inactiveSets[cardSet.id] = [];
    }
    this._inactiveSets[cardSetId].push(cardSet);
    delete this._data[cardSetId];
    _callback(null, cardSetId);
};


/**
 * Gets a cardset with only its Id.
 *
 * @param {string} cardSetId
 * @param {Function} callback - callback(err, cardSet)
 * @return {null}
*/ 
MemoryCsm.prototype.getCardSetById = function(cardSetId, callback){
    var _callback = callback || function(){};
    if(!(cardSetId in this._data)){
        _callback(new Error("Card set did not exist, and could not be fetched"));
        return;
    }
    var cardSet = this._data[cardSetId];
    _callback(null, cardSet);
};


/**
 * Gets an array containing the cardSetId strings of every 
 * available cardset.
 *
 * @param {Function} callback - callback(err, cardSetNames)
 * @return {null}
*/ 
MemoryCsm.prototype.getAvailableCardSets = function(callback){
    callback(null, _.keys(this._data));
};


/**
 * Gets all the cards in a particular cardset based 
 * on a cardSetId.
 *
 * @param {string} cardSetId
 * @param {Function} callback - callback(err, cardSetCards)
 * @return {null}
*/ 
MemoryCsm.prototype.getCardSetCardsById = function(cardSetId, callback){
   this.getCardSetById(cardSetId, function(err, cardSet){
        if(err){
            callback(err);
            return;
        }
        callback(err, cardSet.cards);
   });
};


module.exports = MemoryCsm;
