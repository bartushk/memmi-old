var should = require("should");
var config = require('../../config/config-factory').getConfig();
var monPhm = require('../../lib/phm/mongo-phm');
var monUtil = require('../mongo-utils');
var testData = require('../assets/test-data');
var mongoClient = require('mongodb').MongoClient;

monUtil.initData();

var existingPlayer = {'playerId': 'kyle', 'isAnon': false};
var nonExistantPlayer = {'playerId': 'bob', 'isAnon': false};
var anonPlayer = {'playerId': 'bob', 'isAnon': true};
var goodCardset = 'cardset1';

var testCardUpdate = testData.getCardSet1GoodUpdate();
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

    it('When constructed, url and collection set from config.', function(){
        var phm = new monPhm();  
        should.equal(phm._url, config.mongo.url);
        should.equal(phm._collection, config.mongo.historyCollection);
    });

});

describe('mongo-phm, getPlayerHistory', function(){

    it('When url is bad location, error returned.', function(done){
        var phm = new monPhm();
        phm._url = "mongodb://doesnt_exist";
        phm.getPlayerHistory(goodCardset, existingPlayer, function(err, history){
            should.exist(err);
            should.not.exist(history);
            done();
        });
    });

    it('When player is anon, history not added to mongodb.', function(done){
        var phm = new monPhm();
        var player = {isAnon: true, playerId: 'jimbo'};
        phm.getPlayerHistory(goodCardset, player, function(err, createdHistory){
            getHistory(player.playerId, goodCardset, function(history){
                should.not.exist(history);
                done();
            });
        });
    });

    it('When player history does not exist, history added to mongodb.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'jimbo'};
        phm.getPlayerHistory(goodCardset, player, function(err, createdHistory){
            should.not.exist(err);
            getHistory(player.playerId, goodCardset, function(history){
                should.exist(history);
                should.equal(history.metaInfo.playerId, player.playerId);
                should.equal(history.metaInfo.cardSetId, goodCardset);
                should.equal(history._playIndex, 0);
                done();
            });
        });
    });

    it('When player history does not exist, return a new blank history.', function(done){
        var phm = new monPhm();
        var player = {isAnon: false, playerId: 'jimbob'};
        phm.getPlayerHistory(goodCardset, player, function(err, createdHistory){
            should.not.exist(err);
            should.exist(createdHistory);
            should.equal(createdHistory.metaInfo.playerId, player.playerId);
            should.equal(createdHistory.metaInfo.cardSetId, goodCardset);
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
        getHistory(existingPlayer.playerId, goodCardset, function(history){
            phm.getPlayerHistory(goodCardset, existingPlayer, function(err, playerHistory){
                should.not.exist(err);
                should.equal(JSON.stringify(playerHistory), JSON.stringify(history));
                done();
            });
        });
   }); 

   it('When player history requested correctly, should not contain _id property.', function(done){
        var phm = new monPhm();
        phm.getPlayerHistory(goodCardset, existingPlayer, function(err, playerHistory){
            should.not.exist(err);
            should.not.exist(playerHistory._id);
            done();
        });
   }); 

});

