var should = require("should");
var _ = require("underscore");
var memPhm = require("../lib/phm/memory-phm");
var memCsm = require("../lib/csm/memory-csm");

var testInitialData = {
    "kyle": {
        'cardset1': {
            '_playIndex': 6,
            'history': {
                'coolCard': {'scores': [0,1,2,2,3,3], 'currentScore': 4, 'playIndicies': [0,1,2,3,4,5] }
            },
        }
    },

    "wanyi": {
        'cardset1': {
            '_playIndex': 6,
            'history': {
                'coolCard': {'scores': [0,1,2,2,3,3], 'currentScore': 4, 'playIndicies': [0,1,2,3,4,5] }
            },
        }
    }
};

var mockCardSet =  {'cards': {'card1':{}, 'card2':{}, 'card3':{}}};

var mockCsm = {
    getCardSetById: function (cardsetId, callback){
        callback(null, mockCardSet);
    }

};

var testCardUpdate = {
    'cardId': 'coolCard',
    'score': 10
};

var testBadCardUpdate = {
    'cardId': 'nerd-card',
    'score': 12
};

function cloneInitialData(){
    return JSON.parse(JSON.stringify(testInitialData));
}

describe('memory-phm construction', function(){
    it('When constructed, object exists.', function(){
        var phm = new memPhm();
        should.exist(phm);
    });

    it('When constructed, initial data set.', function(){
        var initData = {};
        initData.test = "hello";
        var phm = new memPhm(initData);
        should.equal(phm._playerHistory.test, "hello");
    });

    it('When constructed, passed csm set.', function(){
        var initCsm = {};
        initCsm.test = "hello";
        var phm = new memPhm(null, initCsm);
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
    it('When player does not exist, return an error.', function(done){
        var phm = new memPhm(cloneInitialData());
        phm.getPlayerHistory("cardset1", 'bob', function(err, playerHistory){
            should.exist(err);
            done();
        });
    });

    it('When card set does not exist, return an error.', function(done){
        var phm = new memPhm(cloneInitialData());
        phm.getPlayerHistory('asdf', 'kyle', function(err, playerHistory){
            should.exist(err);
            done();
        });
    });

   it('When player history requested correctly, correct history returned.', function(done){
        var phm = new memPhm(cloneInitialData());
        phm.getPlayerHistory('cardset1', 'kyle', function(err, playerHistory){
            should.not.exist(err);
            should.equal(playerHistory._playIndex, 6);
            done();
        });
   }); 

   it('When player history returned, should be deep copy.', function(done){
        var dataClone = cloneInitialData();
        var phm = new memPhm(dataClone);
        phm.getPlayerHistory('cardset1', 'kyle', function(err, playerHistory){
            playerHistory._playIndex = 10;
            should.equal(dataClone.kyle.cardset1._playIndex, 6);
            done();
        });
   });
});

describe('memory-phm, updateCardScore', function(){
    it('When player does not exist, return an error.', function(done){
        var phm = new memPhm(cloneInitialData());
        phm.updateCardScore('cardset1', 'bob', testCardUpdate, function(err){
            should.exist(err);
            done();
        });
    });

    it('When cardset does not exist, return an error.', function(done){
        var phm = new memPhm(cloneInitialData());
        phm.updateCardScore('asdf', 'kyle', testCardUpdate, function(err){
            should.exist(err);
            done();
        });
    });

    it('When passed cardUpdate with cardId that does not exist, passes error.', function(done){
        var phm = new memPhm(cloneInitialData());
        phm.updateCardScore('cardset1', 'kyle', testBadCardUpdate, function(err){
            should.exist(err);
            done();
        });
        
    });

    it('When update applied, score pushed.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData);
        phm.updateCardScore('cardset1', 'kyle', testCardUpdate, function(err){
            should.equal(clonedData.kyle.cardset1.history.coolCard.scores[6], 10);
            done();
        });
    });
    
    it('When update applied, index pushed.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData);
        phm.updateCardScore('cardset1', 'kyle', testCardUpdate, function(err){
            should.equal(clonedData.kyle.cardset1.history.coolCard.playIndicies[6], 6);
            done();
        });
    });

    it('When update applied, score updated.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData);
        phm.updateCardScore('cardset1', 'kyle', testCardUpdate, function(err){
            should.equal(clonedData.kyle.cardset1.history.coolCard.currentScore, 14);
            done();
        });
    });

    it('When update applied, play index updated.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData);
        phm.updateCardScore('cardset1', 'kyle', testCardUpdate, function(err){
            should.equal(clonedData.kyle.cardset1._playIndex, 7);
            done();
        });
    });

});

describe('memory-phm createPlayerHistory', function(){
    it('When card set already exists, error is passed.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData, mockCsm);
        phm.createPlayerHistory('cardset1', 'kyle', function(err){
            should.exist(err);
            done();
        });
    });

    it('When player does not exist, player added.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData, mockCsm);
        phm.createPlayerHistory('cardset1', 'bob', function(err){
            Object.keys(clonedData).should.containEql('bob');
            done();
        });
    });

    it('When created, empty card set history generated.', function(done){
        var clonedData = cloneInitialData();
        var phm = new memPhm(clonedData, mockCsm);
        phm.createPlayerHistory('cardset2', 'kyle', function(err){
            Object.keys(clonedData.kyle).should.containEql('cardset2');
            var newCardHistory = clonedData.kyle.cardset2;
            should.equal(newCardHistory._playIndex, 0);
            _.each(Object.keys(mockCardSet.cards), function(newCardId){
               Object.keys(clonedData.kyle.cardset2.history).should.containEql(newCardId);
               var newHistory = clonedData.kyle.cardset2.history[newCardId];
               should.equal(newHistory.playIndicies.length, 0);
               should.equal(newHistory.scores.length, 0);
            });
            done();
        });
    });
});

