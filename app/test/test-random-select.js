var should = require("should");
var randSelect = require("../lib/selection/random-select");
var testData = require("./assets/test-data");


describe('random-select construction.', function(){
    it('When constructed, object exists.', function(){
        var select = new randSelect();
        should.exist(select);
    });
});

describe('random-select, selectCard.', function(){
    it('When run, returns cardname from history.', function(done){
        var select = new randSelect();
        var cardsetHistory = testData.getCardSetHistory();
        select.selectCard(cardsetHistory, function(err, cardName){
            Object.keys(cardsetHistory.history).should.containEql(cardName);
            done();
        });
    });
});
