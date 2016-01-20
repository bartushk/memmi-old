var _ = require("underscore");




/**
 * Gets a blank player history for a particular cardset.
 *
 * @param {CardSetManager} csm
 * @param {string} cardSetId
 * @param {Function} callback - callback(err, blankCardSet)
 * @return {null}
*/ 
module.exports.getBlankHistory = function(csm, cardSetId, callback){
    csm.getCardSetById(cardSetId, function(err, cardSet){
        if(err){
            callback(err);
            return;
        }
        var newHistory = {};
        newHistory._playIndex = 0;
        newHistory.history = {};
        var cardNames = Object.keys(cardSet.cards);
        _.each(cardNames, function(cardName){
            var cardHistory = {};
            cardHistory.scores = []; 
            cardHistory.playIndicies = [];
            newHistory.history[cardName] = cardHistory;
        });
        callback(null, newHistory);
    });
};
