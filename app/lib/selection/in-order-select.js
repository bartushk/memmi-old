var _ = require('underscore');
var log = require('../log-factory').getLogger();


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
        if( _.isString(previousCard) ){
            log.info("Card with bad previousCard requested:", {'previousCard': previousCard}, cardSetHistory.metaInfo); 
        }
        var firstCardId = _.findKey(cardSetHistory.history, function(cardHistory){
            return cardHistory.cardIndex === 0;
        });
        callback(null, firstCardId);
        return;
    }
    
    var previousIndex = cardSetHistory.history[previousCard].cardIndex;
    var nextCard = _.findKey(cardSetHistory.history, function(cardHistory){
        return cardHistory.cardIndex === previousIndex + 1;
    });
    if(!nextCard){
        nextCard = _.findKey(cardSetHistory.history, function(cardHistory){
            return cardHistory.cardIndex === 0;
        });
    }
    callback(null, nextCard);
};



module.exports = InOrderSelect;
