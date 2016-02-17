var config = require('../config/config-factory').getConfig();
var testData = require('./assets/test-data');
var _ = require('underscore');
var mongoClient = require('mongodb').MongoClient;
var sleep = require('sleep');

var dataInitialized = false;

//TODO: change this to use a callback and wrap all tests in it.
module.exports.initData = function(){
    if(dataInitialized)
        return;
    dataInitialized = true;

    var fullHistory = testData.getFullHistory();
    mongoClient.connect(config.mongo.url, function(err, db){
        var historyCol = db.collection(config.mongo.historyCollection);
        _.each(fullHistory, function(playerHistory, playerId){
            _.each(playerHistory, function(cardsetHistory, cardSetId){
                historyCol.insert(cardsetHistory);
            });
        });
        var cardSetCol = db.collection(config.mongo.cardSetCollection);
        cardSetCol.insert(testData.getCardSet1());
        cardSetCol.insert(testData.getCardSet2());
    });
    // hack: wait 1 second to make sure the database populates.
    sleep.sleep(2);
};
