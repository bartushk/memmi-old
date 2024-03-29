

/**
 * Simple card selection algoirthm that selects cards randomly.
 *
*/ 

function RandomSelect(){

}


/**
 * Selection function, randomly picks a crad from the player history.
 *  
 * @param {Object} cardsetHistory 
 * @param {string} previousCard 
 * @param {Function} callback - callback(err, cardname)
 * @return {null}
 *
*/ 
RandomSelect.prototype.selectCard = function(cardsetHistory, previousCard, callback){
    var cardNames = Object.keys(cardsetHistory.history);  
    if(cardNames.length < 1){
        callback(new Error("Cardset history length was less than 1."));
    }
    var index = Math.floor(Math.random() * cardNames.length); 
    callback(null, cardNames[index]);
};

module.exports = RandomSelect;
