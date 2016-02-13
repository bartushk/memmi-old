var should = require("should");
var _ = require("underscore");
var memPhm = require("../../lib/phm/memory-phm");
var memCsm = require("../../lib/csm/memory-csm");
var testData = require("../assets/test-data");

var mockCsm = {
    getCardSetById: function (cardsetId, callback){
        callback(null, testData.getCardSet2());
    }
};

var existingPlayer = {'playerId': 'kyle', 'isAnon': false};
var nonExistantPlayer = {'playerId': 'bob', 'isAnon': false};
var anonPlayer = {'playerId': 'bob', 'isAnon': true};

var testCardUpdate = testData.getCardSet1GoodUpdate();
var testBadCardUpdate = testData.getCardSet1BadUpdate();

describe('memory-phm construction', function(){
    it('When constructed, object exists.', function(){
        var phm = new memPhm();
        should.exist(phm);
    });

    it('When constructed, initial data set.', function(){
        var initData = {};
        initData.test = "hello";
        var phm = new memPhm(null, initData);
        should.equal(phm._playerHistory.test, "hello");
    });

    it('When constructed, passed csm set.', function(){
        var initCsm = {};
        initCsm.test = "hello";
        var phm = new memPhm(initCsm);
        should.equal(phm._csm.test, "hello");
    });

    it('When constructed, data defaulted to empty dict.', function(){
        var phm = new memPhm();
        should.deepEqual(_.keys(phm._playerHistory),[]);
    });

    it('When constructed, card set manager should default to MemoryCsm.', function(){
        var phm = new memPhm();
        (5).should.be.exactly(5);
        phm._csm.should.be.an.instanceof(memCsm);
    });
});

describe('memory-phm, getPlayerHistory.', function(){
    it('When player does not exist, return a new blank history.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(mockCsm, clonedData);
        phm.getPlayerHistory("cardset1", nonExistantPlayer, function(err, playerHistory){
            should.equal(playerHistory._playIndex, 0);
            done();
        });
    });

    it('When card set does not exist, return an error.', function(done){
        var phm = new memPhm(null, testData.getFullHistory());
        phm.getPlayerHistory('asdf', existingPlayer, function(err, playerHistory){
            should.exist(err);
            done();
        });
    });

   it('When player history requested correctly, correct history returned.', function(done){
        var data = testData.getFullHistory();
        var phm = new memPhm(null, data);
        phm.getPlayerHistory('cardset1', existingPlayer, function(err, playerHistory){
            should.not.exist(err);
            should.equal(playerHistory._playIndex, data.kyle.cardset1._playIndex );
            done();
        });
   }); 

   it('When player history returned, should be deep copy.', function(done){
        var dataClone = testData.getFullHistory();
        var phm = new memPhm(null, dataClone);
        phm.getPlayerHistory('cardset1', existingPlayer, function(err, playerHistory){
            playerHistory._playIndex = 10;
            should.equal(dataClone.kyle.cardset1._playIndex, testData.getFullHistory().kyle.cardset1._playIndex);
            done();
        });
   });

   it('When anon player history is requested, return empty history.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(mockCsm, clonedData);
        phm.getPlayerHistory('cardset1', anonPlayer, function(err, playerHistory){
            should.equal(playerHistory._playIndex, 0);
            done();
        });
   });

});

describe('memory-phm, updateCardScore', function(){
    it('When player does not exist, return an error.', function(done){
        var phm = new memPhm(null, testData.getFullHistory());
        phm.updateCardScore('cardset1', nonExistantPlayer, testCardUpdate, function(err){
            should.exist(err);
            done();
        });
    });

    it('When cardset does not exist, return an error.', function(done){
        var phm = new memPhm(null, testData.getFullHistory());
        phm.updateCardScore('asdf', existingPlayer, testCardUpdate, function(err){
            should.exist(err);
            done();
        });
    });

    it('When passed cardUpdate with cardId that does not exist, passes error.', function(done){
        var phm = new memPhm(null, testData.getFullHistory());
        phm.updateCardScore('cardset1', existingPlayer, testBadCardUpdate, function(err){
            should.exist(err);
            done();
        });
        
    });

    it('When update applied, score pushed.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(null, clonedData);
        phm.updateCardScore('cardset1', existingPlayer, testCardUpdate, function(err){
            var scores = clonedData.kyle.cardset1.history.coolCard.scores;
            should.equal(scores[scores.length - 1], testCardUpdate.score);
            done();
        });
    });
    
    it('When update applied, index pushed.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(null, clonedData);
        phm.updateCardScore('cardset1', existingPlayer, testCardUpdate, function(err){
            var indicies = clonedData.kyle.cardset1.history.coolCard.playIndicies;
            should.equal(indicies[indicies.length - 1], clonedData.kyle.cardset1._playIndex - 1);
            done();
        });
    });

    it('When update applied, score updated.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(null, clonedData);
        phm.updateCardScore('cardset1', existingPlayer, testCardUpdate, function(err){
            var targetScore = testData.getFullHistory().kyle.cardset1.history.coolCard.currentScore + testCardUpdate.score;
            should.equal(clonedData.kyle.cardset1.history.coolCard.currentScore, targetScore);
            done();
        });
    });

    it('When update applied, play index updated.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(null, clonedData);
        phm.updateCardScore('cardset1', existingPlayer, testCardUpdate, function(err){
            var targetIndex = testData.getFullHistory().kyle.cardset1._playIndex + 1;
            should.equal(clonedData.kyle.cardset1._playIndex, targetIndex);
            done();
        });
    });

});

describe('memory-phm createPlayerHistory', function(){
    it('When card set already exists, error is passed.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(mockCsm, clonedData);
        phm.createPlayerHistory('cardset1', existingPlayer, function(err){
            should.exist(err);
            done();
        });
    });

    it('When player does not exist, player added.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(mockCsm, clonedData);
        phm.createPlayerHistory('cardset1', nonExistantPlayer, function(err){
            Object.keys(clonedData).should.containEql(nonExistantPlayer.playerId);
            done();
        });
    });

    it('When created, empty card set history generated.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(mockCsm, clonedData);
        phm.createPlayerHistory('cardset2', existingPlayer, function(err){
            Object.keys(clonedData[existingPlayer.playerId]).should.containEql('cardset2');
            var newCardHistory = clonedData[existingPlayer.playerId].cardset2;
            should.equal(newCardHistory._playIndex, 0);
            _.each(Object.keys(testData.getCardSet2().cards), function(newCardId){
               Object.keys(clonedData[existingPlayer.playerId].cardset2.history).should.containEql(newCardId);
               var newHistory = clonedData[existingPlayer.playerId].cardset2.history[newCardId];
               should.equal(newHistory.playIndicies.length, 0);
               should.equal(newHistory.scores.length, 0);
            });
            done();
        });
    });

    it('When created, meta data added.', function(done){
        var clonedData = testData.getFullHistory();
        var phm = new memPhm(mockCsm, clonedData);
        phm.createPlayerHistory('cardset2', existingPlayer, function(err){
            var newCardHistory = clonedData[existingPlayer.playerId].cardset2;
            should.exist(newCardHistory.metaInfo);
            should.equal(newCardHistory.metaInfo.playerId, existingPlayer.playerId);
            should.equal(newCardHistory.metaInfo.cardsetId, 'cardset2');
            done();
        });
    });
});

