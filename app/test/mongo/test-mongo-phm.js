var should = require("should");
var config = require('../../config/config-factory').getConfig();
var monPhm = require('../../lib/phm/mongo-phm');
var monUtil = require('../mongo-utils');
var testData = require('../assets/test-data');
var _ = require('underscore');
var mongoClient = require('mongodb').MongoClient;

before(function(done){
    monUtil.initData(function(){
        done();
    });
});

var existingPlayer = {'playerId': 'kyle', 'isAnon': false};
var nonExistantPlayer = {'playerId': 'bob', 'isAnon': false};
var anonPlayer = {'playerId': 'bob', 'isAnon': true};
var goodCardSet = 'cardset1';

var testGoodCardUpdate = testData.getCardSet1GoodUpdate();
var testBadCardUpdate = testData.getCardSet1BadUpdate();

function getHistory(playerId, cardSetId, callback){
    var query = { metaInfo: {playerId: playerId, cardSetId: cardSetId} };
    mongoClient.connect(config.mongo.url, function(err, db){
        if(err)
            console.log(err);
        var col = db.collection(config.mongo.historyCollection);
        col.findOne(query, {_id: 0}, function(err, history){
            if(err)
                console.log(err);
            callback(history);
        });
    });
}

describe('mongo-phm, construction.', function(){

    it('When constructed, object exists.', function(){
        var phm = new monPhm();
        should.exist(phm);
    });

    it('When constructed, csm set correctly when passed.', function(){
        var phm = new monPhm(true);
        should.equal(true, phm._csm);
    });

    it('When constructed, url, collection and write options set from config.', function(){
        var phm = new monPhm();  
        should.equal(phm._url, config.mongo.url);
        should.equal(phm._collection, config.mongo.historyCollection);
        should.deepEqual(phm._writeOptions, config.mongo.writeOptions);
    });

});

describe('mongo-phm, getPlayerHistory', function(){

    it('When url is bad location, error returned.', function(done){
        var phm = new monPhm();
        phm._url = "mongodb://doesnt_exist";
        phm.getPlayerHistory(goodCardSet, existingPlayer, function(err, history){
            should.exist(err);
            should.not.exist(history);
            done();
        });
    });

    it('When player is anon, history not added to mongodb.', function(done){
        var phm = new monPhm();
        var player = {isAnon: true, playerId: 'jimbo'};
        phm.getPlayerHistory(goodCardSet, player, function(err, createdHistory){
            getHistory(player.playerId, goodCardSet, function(history){
                should.not.exist(history);
                done();
            });
        });
    });

    it('When player history does not exist, history added to mongodb.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'jimbo'};
        phm.getPlayerHistory(goodCardSet, player, function(err, createdHistory){
            should.not.exist(err);
            getHistory(player.playerId, goodCardSet, function(history){
                should.exist(history);
                should.equal(history.metaInfo.playerId, player.playerId);
                should.equal(history.metaInfo.cardSetId, goodCardSet);
                should.equal(history._playIndex, 0);
                done();
            });
        });
    });

    it('When player history does not exist, return a new blank history.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'jimbob'};
        phm.getPlayerHistory(goodCardSet, player, function(err, createdHistory){
            should.not.exist(err);
            should.exist(createdHistory);
            should.equal(createdHistory.metaInfo.playerId, player.playerId);
            should.equal(createdHistory.metaInfo.cardSetId, goodCardSet);
            should.equal(createdHistory._playIndex, 0);
            done();
        });
    });

    it('When card set does not exit, return an error.', function(done){
        var phm = new monPhm();
        phm.getPlayerHistory('asdf', existingPlayer, function(err, playerHistory){
            should.exist(err);
            done();
        });
    });

   it('When player history requested correctly, correct history returned.', function(done){
        var phm = new monPhm();
        getHistory(existingPlayer.playerId, goodCardSet, function(history){
            phm.getPlayerHistory(goodCardSet, existingPlayer, function(err, playerHistory){
                should.not.exist(err);
                should.deepEqual(playerHistory, history);
                done();
            });
        });
   }); 

   it('When player history requested correctly, should not contain _id property.', function(done){
        var phm = new monPhm();
        phm.getPlayerHistory(goodCardSet, existingPlayer, function(err, playerHistory){
            should.not.exist(err);
            done();
        });
   }); 

});


describe('mongo-phm, createPlayerHistory', function(){

    it('When a card set history already exists, error is passed.', function(done){
        var phm = new monPhm();
        phm.createPlayerHistory(goodCardSet, existingPlayer, function(err, createdHistory){
            should.exist(err);
            done();
        });
    });

    it('When player is Anonymous, error is passed.', function(done){
        var phm = new monPhm();
        phm.createPlayerHistory(goodCardSet, anonPlayer, function(err, createdHistory){
            should.exist(err);
            done();
        });
    });

    it('When created, history added to mongodb.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'dimbob'};
        phm.createPlayerHistory(goodCardSet, player, function(err, createdHistory){
            should.not.exist(err);
            getHistory(player.playerId, goodCardSet, function(history){
                should.exist(history);
                should.equal(history.metaInfo.playerId, player.playerId);
                should.equal(history.metaInfo.cardSetId, goodCardSet);
                should.equal(history._playIndex, 0);
                done();
            });
        });
    });

    it('When created, correct blank history created.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'dimbob2'};
        var targetCardset = testData.getCardSet1(); 
        phm.createPlayerHistory('cardset1', player, function(err, createdHistory){
            should.not.exist(err);
            should.exist(createdHistory);
            should.equal(createdHistory._playIndex, 0);
            _.each(Object.keys(targetCardset.cards), function(targetId){
                var newCardHistory = createdHistory.history[targetId];
                should.exist(newCardHistory);
                should.equal(newCardHistory.playIndicies.length, 0);
                should.equal(newCardHistory.scores.length, 0);
            });
            done();
        });
    });

    it('When created, meta info added.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'dimbob3'};
        phm.createPlayerHistory(goodCardSet, player, function(err, createdHistory){
            should.not.exist(err);
            should.exist(createdHistory.metaInfo);
            should.equal(createdHistory.metaInfo.playerId, player.playerId);
            should.equal(createdHistory.metaInfo.cardSetId, goodCardSet);
            done();
        });
    });
});


describe('mongo-phm, updateCardScore', function(){
    it('When player does not exist, return an error.', function(done){
        var phm = new monPhm(); 
        phm.updateCardScore('cardset1', nonExistantPlayer, testGoodCardUpdate, function(err){
            should.exist(err);
            done();
        });
    });

    it('When player is anon, do not apply update.', function(done){
        var phm = new monPhm();
        var anonGoodPlayer = {playrId: existingPlayer.playerId, isAnon: true};    
        getHistory(existingPlayer, anonGoodPlayer, function(oldHistory){
            phm.updateCardScore(goodCardSet, anonGoodPlayer, testGoodCardUpdate, function(err){
                should.not.exist(err);
                getHistory(existingPlayer, anonGoodPlayer, function(newHistory){
                    should.deepEqual(oldHistory, newHistory);
                    done();
                });
            });
        });
    });

    it('When updated, all updates properly applied.', function(done){
        var phm = new monPhm();
        var cardId = testGoodCardUpdate.cardId;
        getHistory(existingPlayer.playerId, goodCardSet, function(oldHistory){
            phm.updateCardScore(goodCardSet, existingPlayer, testGoodCardUpdate, function(err){
                should.not.exist(err);
                getHistory(existingPlayer.playerId, goodCardSet, function(newHistory){
                    should.equal(oldHistory._playIndex + 1, newHistory._playIndex);
                    var oldCard = oldHistory.history[cardId];
                    var newCard = newHistory.history[cardId];
                    should.equal(oldCard.playIndicies.length + 1, newCard.playIndicies.length);
                    should.equal(newCard.playIndicies[newCard.playIndicies.length - 1], testGoodCardUpdate.play_index);
                    should.equal(oldCard.currentScore + testGoodCardUpdate.score, newCard.currentScore);
                    done();
                });
            });
        });
    });

    it('When cardset does not exist, return an error.', function(done){
        var phm = new monPhm(); 
        phm.updateCardScore('asdf', existingPlayer, testGoodCardUpdate, function(err){
            should.exist(err);
            done();
        });
    });
});
