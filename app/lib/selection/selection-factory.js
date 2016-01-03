var randomSelect = require('./random-select');
var random = new randomSelect();

var factory = {

};

/**
 * Gets a selection algorith my name.
 *
 * @param {string} algorithmName
 * @return {SelectionAlgorithm}
*/ 
factory.getSelectionAlgorithm = function(algorithmName){
    switch(algorithmName){
        case 'random':
            return random;

        default:
            return random;

    }
};


module.exports = factory;
