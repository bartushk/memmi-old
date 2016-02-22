var _ = require('underscore');


/**
 * In order card selection method. 
 *
*/ 

function InOrderSelect(){

}


/**
 * This slection method moves through the cards in a card set in order.
 * If a previous card is not given or if the previous card is not valid,
 * the the first card is returned.
 *  
 * @param {Object} cardSetHistory 
 * @param {string} previousCard 
 * @param {Function} callback - callback(err, cardname)
 * @return {null}
 *
*/ 
InOrderSelect.prototype.selectCard = function(cardSetHistory, previousCard, callback){
    if(!previousCard || !(previousCard in cardSetHistory.history)){
        var firstCardName = _.first(Object.keys(cardSetHistory.history), function(cardName){
            return cardSetHistory[cardName].cardIndex === 0;
        });
        callback(null, cardSetHistory.history[firstCardName]);
        return;
    }
    
    var previousIndex = cardSetHistory.history[previousCard].cardIndex;
    var nextCard = _.first(Object.keys(cardSetHistory.history), function(cardName){
        return cardSetHistory[cardName].cardIndex === previousIndex + 1;
    });
    if(!nextCard){
        nextCard = _.first(Object.keys(cardSetHistory.history), function(cardName){
            return cardSetHistory[cardName].cardIndex === 0;
        });
    }
    callback(null, nextCard);
};



module.exports = InOrderSelect;
