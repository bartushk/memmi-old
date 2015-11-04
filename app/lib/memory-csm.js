var cardValidator = require('./validators/card-validator');

function MemoryCsm(initalData){
    this.data = initialData || {};
    this.inactiveSets = {};

    this.cardValidator = cardValidator;
}

MemoryCsm.prototype.setCardValidator = function(validator){
    this.cardValidator = validator;
}

MemoryCsm.prototype.addCardSet = function(cardSet, callback){
    this.cardValidator.validate(cardSet)

}




