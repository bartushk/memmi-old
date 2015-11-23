var _cardSetValidator = require('./validators/card-set-validator');

function MemoryCsm(initialData, cardSetValidator){
    this._data = initialData || {};
    this._inactiveSets = {};
    this.cardSetValidator = cardSetValidator || new _cardSetValidator();
}

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

MemoryCsm.prototype.deactivateCardSetById = function(cardSetId, callback){
	var _callback = callback || function(){};
	if(!(cardSetId in this._data)){
		_callback(new Error("Card set did not exist, and could not be deactivated"));
		return;
	}
	cardSet._inactiveDate = new Date();
	if(!(cardSet.id in this._inactiveSets)){
		this._inactiveSets[cardSet.id] = [];
	}
	this._inactiveSets[cardSet.id].push(cardSet);
	delete this._data[cardSetId];
	_callback(null, cardSetId);
};

MemoryCsm.prototype.getCardSetById = function(cardSetId, callback){
	var _callback = callback || function(){};
	if(!(cardSetId in this._data)){
		_callback(new Error("Card set did not exist, and could not be fetched"));
		return;
	}
	var cardSet = this._data[cardSetId];
	_callback(null, cardSet);
};

module.exports = MemoryCsm;
