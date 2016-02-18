var config = require('../config/config-factory').getConfig();
var testData = require('./assets/test-data');
var _ = require('underscore');
var mongoClient = require('mongodb').MongoClient;

var dataInitialized = false;

module.exports.initData = function(callback){
    if(dataInitialized){
        callback();
        return;
    }
    dataInitialized = true;

    var fullHistory = testData.getFullHistory();
    mongoClient.connect(config.mongo.url, function(err, db){
        var historyCol = db.collection(config.mongo.historyCollection);
        var histories = [];
        _.each(fullHistory, function(playerHistory, playerId){
            _.each(playerHistory, function(cardsetHistory, cardSetId){
                histories.push(cardsetHistory);
            });
        });
        historyCol.insertMany(histories, {w:1}, function(err, r){
            if(err){
                console.log(err);
                callback(err);
                return;
            }
            var cardSetCol = db.collection(config.mongo.cardSetCollection);
            cardSetCol.insert(testData.getCardSet1(), {w:1}, function(err, r){
                if(err){
                    console.log(err);
                    callback(err);
                    return;
                }
                cardSetCol.insert(testData.getCardSet1(), {w:1}, function(err, r){
                    if(err){
                        console.log(err);
                        callback(err);
                        return;
                    }
                    var userCol = db.collection(config.mongo.userCollection);
                    userCol.insert(testData.getUserStore(), {w:1}, function(err, r){
                        if(err){
                            console.log(err);
                            callback(err);
                            return;
                        }
                        callback(null);
                    });
                });
            });
        });
    });
};
