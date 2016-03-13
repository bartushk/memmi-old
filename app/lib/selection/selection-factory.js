var randomSelect = require('./random-select');
var inOrderSelect = require('./in-order-select');
var random = new randomSelect();
var inorder = new inOrderSelect();

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
        case 'in-order':
            return inorder; 
        case 'random':
            return random;
    }
};


module.exports = factory;
