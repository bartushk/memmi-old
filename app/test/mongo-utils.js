var config = require('../config/config-factory').getConfig();
var testData = require('./assets/test-data');
var _ = require('underscore');
var mongoClient = require('mongodb').MongoClient;

var dataInitialized = false;

module.exports.initData = function(){
    if(dataInitialized)
        return;

    dataIntialized = true;
    var fullHistory = testData.getFullHistory();
    mongoClient.connect(config.mongo.url, function(err, db){
        var collection = db.collection(config.mongo.historyCollection);
        _.each(fullHistory, function(playerHistory, playerId){
            _.each(playerHistory, function(cardsetHistory, cardSetId){
                collection.insert(cardsetHistory);
            });
        });
    });
};
