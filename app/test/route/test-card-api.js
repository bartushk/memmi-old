var config = require('../../config/config-factory').getConfig();
var should = require('should');
var _ = require('underscore');
var supertest = require('supertest');
var app = require('../../app');
var supertestLogin = require('../test-utils').supertestLogin;
var testCardset1 = require('../assets/test-data').getCardSet1();
var playerHistoryManager = require('../../lib/phm/phm-factory').getPhm();

var cardset1Cards = Object.keys(testCardset1.cards);


describe('card-api, get-next.', function(){

    var goodPostBody = {"cardset": "cardset1", "algorithm": "random"};
    var badCardsetBody = {"cardset": "doesnt_exit", "algorithm": "random"};
    var badAlgoBody = {"cardset": "cardset", "algorithm": "doesnt_exist"};
    var route = "/card-api/get-next";

    it('When body is empty, 400 returned.', function(done){
        supertest(app)
            .post(route)
            .send({})
            .expect(400, done);
    });

    it('When cardset does not exist, 400 returned.', function(done){
        supertest(app)
            .post(route)
            .send(badCardsetBody)
            .expect(400, done);
    });

    it('When algorithm does not exist, 400 returned.', function(done){
        supertest(app)
            .post(route)
            .send(badAlgoBody)
            .expect(400, done);
    });

    it('When requested anon, algorithm and cardset exist; card is returned.', function(done){
        supertest(app)
            .post(route)
            .send(goodPostBody)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                cardset1Cards.should.containEql(res.body.card.id);
                done();
            });
    });

    it('When requested with good identity, algorithm and cardset; card is returned.', function(done){
        supertestLogin(function(err, agent){        
            agent.post(route)
            .send(goodPostBody)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                cardset1Cards.should.containEql(res.body.card.id);
                done();
            });
        });
    });

    it('When requested with good identity, algorithm, cardset and previousCard; card is returned.', function(done){
        var postBody = JSON.parse(JSON.stringify(goodPostBody));
        postBody.previousCard = "_none";
        supertestLogin(function(err, agent){        
            agent.post(route)
            .send(postBody)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                cardset1Cards.should.containEql(res.body.card.id);
                done();
            });
        });
    });
});


describe('card-api, report.', function(){

    var goodPostBody = {'cardset': 'cardset1', 'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 2 }};
    var badCardset = {'cardset': 'doesnt_exist', 'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 2 }};
    var badCardId = {'cardset': 'cardset1', 'cardUpdate': {'cardId': 'doesnt_exit', 'score': 1, 'play_index': 2 }};
    var badScore = {'cardset': 'cardset1', 'cardUpdate': {'cardId': 'coolCard', 'score': 'asdf', 'play_index': 2 }};
    var badPlayIndex = {'cardset': 'cardset1', 'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 'asdf' }};
    var noUpdateBody = {'cardset': 'cardset1'};
    var route = "/card-api/report";

    it('When update isAnon, 200 returned.', function(done){
        supertest(app)
            .post(route)
            .send(goodPostBody)
            .expect(200, done);
    });

    
    it('When logged in and body is empty, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send({})
            .expect(400, done);
        });
    });

    it('When logged in and cardset does not exist, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badCardset)
            .expect(400, done);
        });
    });
    
    it('When logged in and cardId does not exist, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badCardId)
            .expect(400, done);
        });
    });

    it('When logged in and card score is not a number. ', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badScore)
            .expect(400, done);
        });
    });

    it('When logged in and card play index is not a number. ', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badPlayIndex)
            .expect(400, done);
        });
    });
    
    it('When logged in and update does not exist, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(noUpdateBody)
            .expect(400, done);
        });
    });

    it('When logged in and good update body in request, 200 returned and history updated.', function(done){
        playerHistoryManager.getPlayerHistory('cardset1', {'playerId':'doodie', 'isAnon': false},function(err, res){
            var oldValue = res._playIndex;
            supertestLogin(function(err, agent){
                agent.post(route)
                .send(goodPostBody)
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    playerHistoryManager.getPlayerHistory('cardset1', {'playerId':'doodie', 'isAnon': false},function(err, res){
                        should.equal(oldValue + 1, res._playIndex);
                        done();
                    });
                });
            });
        });
    });

});

describe('card-api, report-get-next.', function(){

    var goodPostBody = {'cardset': 'cardset1', 'algorithm': 'random', 
    'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 20 }};
    var badCardset = {'cardset': 'doesnt_exist', 'algorithm': 'random', 
    'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 20 }};
    var badCardId = {'cardset': 'cardset1', 'algorithm': 'random', 
    'cardUpdate': {'cardId': 'doesnt_exit', 'score': 1, 'play_index': 20 }};
    var badScore = {'cardset': 'cardset1', 'algorithm': 'random', 
    'cardUpdate': {'cardId': 'coolCard', 'score': 'asdf', 'play_index': 20 }};
    var badAlgo = {'cardset': 'cardset1', 'algorithm': 'doesnt_exist', 
    'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 20 }};
    var badPlayIndex = {'cardset': 'cardset1', 'algorithm': 'random', 
    'cardUpdate': {'cardId': 'coolCard', 'score': 1, 'play_index': 'asdf' }};
    var noUpdateBody = {'cardset': 'cardset1'};
    var route = "/card-api/report-get-next";

    it('When update isAnon, 200 returned.', function(done){
        supertest(app)
            .post(route)
            .send(goodPostBody)
            .expect(200, done);
    });

    
    it('When logged in and body is empty, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send({})
            .expect(400, done);
        });
    });

    it('When logged in and cardset does not exist, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badCardset)
            .expect(400, done);
        });
    });

    it('When logged in and algorithm does not exist, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badAlgo)
            .expect(400, done);
        });
    });
    
    it('When logged in and cardId does not exist, 200 returned, update success false.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badCardId)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                should.equal(res.body.updateSuccess, false);
                done();
            });
        });
    });

    it('When logged in and card score is not a number. ', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badScore)
            .expect(400, done);
        });
    });

    it('When logged in and card play index is not a number. ', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(badPlayIndex)
            .expect(400, done);
        });
    });

    it('When logged in and update does not exist, 400 returned.', function(done){
        supertestLogin(function(err, agent){
            agent.post(route)
            .send(noUpdateBody)
            .expect(400, done);
        });
    });

    it('When logged in and good update body in request, 200 returned and history updated.', function(done){
        playerHistoryManager.getPlayerHistory('cardset1', {'playerId':'doodie', 'isAnon': false},function(err, res){
            var oldValue = res._playIndex;
            supertestLogin(function(err, agent){
                agent.post(route)
                .send(goodPostBody)
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    should.equal(res.body.updateSuccess, true);
                    playerHistoryManager.getPlayerHistory('cardset1', {'playerId':'doodie', 'isAnon': false},function(err, res){
                        should.equal(oldValue + 1, res._playIndex);
                        done();
                    });
                });
            });
        });
    });

    it('When logged in and good update body in request, 200 returned card in response.', function(done){
        supertest(app)
            .post(route)
            .send(goodPostBody)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                cardset1Cards.should.containEql(res.body.card.id);
                done();
            });
    });

    it('When logged in and good update body in request with previousCard, 200 returned card in response.', function(done){
        var postBody = JSON.parse(JSON.stringify(goodPostBody));
        postBody.previousCard = '_none';
        supertest(app)
            .post(route)
            .send(postBody)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                cardset1Cards.should.containEql(res.body.card.id);
                done();
            });
    });

});
