var config = require('../config/config-factory').getConfig();
var testData = require('./assets/test-data');
var _ = require('underscore');
var mon = require('mongodb');
var mongoClient = mon.MongoClient;
var objId = mon.ObjectID;
var dataInitialized = false;

module.exports.initData = function(){
    if(dataInitialized)
        return;

    dataIntialized = true;
    var fullHistory = testData.getFullHistory();
    mongoClient.connect(config.mongo.url, function(err, db){
        console.log(err);
        var collection = db.collection(config.mongo.historyCollection);
        _.each(fullHistory, function(playerHistory, playerId){
            _.each(playerHistory, function(cardsetHistory, cardsetId){
                cardsetHistory._id = objId(cardSetId + playerObj.playerId);
                collection.insert(cardsetHistory);
            });
        });
    });
};
