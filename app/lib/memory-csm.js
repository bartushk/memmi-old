var _cardSetValidator = require('./validators/card-set-validator');

function MemoryCsm(initialData, cardSetValidator){
    this._data = initialData || {};
    this.inactiveSets = {};
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
    this._data[cardSet.id] = cardSet;
	_callback(null, cardSet);
};

MemoryCsm.prototype.deleteCardSet = function(cardSet, callback){
	var _callback = callback || function(){};
	var validationResult = this.cardSetValidator.validate(cardSet);
	if(validationResult != this.cardSetValidator.ok){
		_callback(new Error("Card set did not validate"), cardSet);
		return;
	}
	if(!(cardSet.id in this._data)){
		_callback(new Error("Card set did not exist, and could not be deleted"));
		return;
	}
	delete this._data[cardSet.id];
	_callback(null, cardSet);
};

MemoryCsm.prototype.deleteCardSetById = function(cardSetId, callback){
	var _callback = callback || function(){};
	if(!(cardSetId in this._data)){
		_callback(new Error("Card set did not exist, and could not be deleted"));
		return;
	}
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
