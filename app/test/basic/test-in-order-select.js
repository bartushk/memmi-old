var should = require("should");
var inSelect = require("../../lib/selection/in-order-select");
var testData = require("../assets/test-data");

var testHistory = testData.getFullHistory().kyle.cardset1;

describe('in-order-select construction.', function(){
    it('When constructed, object exists.', function(){
        var select = new inSelect();
        should.exist(select);
    });
});


describe('in-order-select, selectCard', function(){
    it('When no previous card is passed, first card in set is returned.', function(done){
        var select = new inSelect();
        select.selectCard(testHistory, null, function(err, nextCard){
            should.not.exist(err);
            should.equal(nextCard, 'coolCard');
            done();
        });
    });

    it("When previous card is not valid, first card in set is returned.", function(done){
        var select = new inSelect();
        select.selectCard(testHistory, "not_a_card", function(err, nextCard){
            should.not.exist(err);
            should.equal(nextCard, 'coolCard');
            done();
        });
    });

    it("When previous card is valid, next card in set is returned.", function(done){
        var select = new inSelect();
        select.selectCard(testHistory, "coolCard", function(err, nextCard){
            should.not.exist(err);
            should.equal(nextCard, 'nerdCard');
            select.selectCard(testHistory, "nerdCard", function(err, nextCard){
                should.not.exist(err);
                should.equal(nextCard, 'dudeCard');
                done();
            });
        });
    });

    it("When previous card is last card, first card in set is returned.", function(done){
        var select = new inSelect();
        select.selectCard(testHistory, "dudeCard", function(err, nextCard){
            should.not.exist(err);
            should.equal(nextCard, 'coolCard');
            done();
        });
    });
});
