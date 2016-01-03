var express = require('express');
var idProvider = require('../lib/auth/mock-identity-provider');
var selectionFactory = require('../lib/selection/selection-factory');
var memPhm = require('../lib/phm/memory-phm');
var memCsm = require('../lib/csm/memory-csm');
var testData = require('../test/assets/test-data');


/**
 * Api for card related actions. Allows someone to
 * get the next card for a certain set and report on
 * cards.
 *
*/ 

var router = express.Router();
var playerHistory = new memPhm(testData.getFullHistory());
var cardsetManager = new memCsm(testData.getFullCardSet());
var identityProvider = new idProvider('kyle');

/**
 * This endpoint returns the next card for a particular person based on the
 * requested cardset information.
 *
 * req body format:
 *
 * { 'cardset': 'cardsetName', 'algorithm': 'selectionAlgorithmToUse' }
 *
*/ 
router.post('/get-next', function(req, res){
    var cardsetId = req.body.cardset;
    var selectionAlgorithm = req.body.algorithm;
    identityProvider.getIdentity(req, function(err, identity){
        var selection = selectionFactory.getSelectionAlgorithm(selectionAlgorithm);
        playerHistory.getPlayerHistory(cardsetId, identity.playerId, function(err, history){
            if(err){ res.status(500).send("An error occured finding that player's history.");return;}
            selection.selectCard(history, function(err, cardName){
                if(err){ res.status(500).send("An error occured selecting the next card.");return;}
                cardsetManager.getCardSetById(cardsetId, function(err, cardSet){
                    if(err){ res.status(500).send("An error occured getting the next card.");return;}
                    var requestReply = cardSet.cards[cardName];
                    res.send(requestReply);
                });
            });
        });
    });
});


/**
 * After viewing a card, a player has the option to score it. This endpoint
 * receives the result of their scoring and updates their player history
 * accordingly. Anon players have no history recorded.
 *
 * req body format:
 *
 * { 'cardUpdate': { 'cardId': 'cardIdentifier', 'score': 1} }
*/ 
router.post('/report', function(req, res){

});


/**
 * The typical usage will be a report, then the immediate presentation
 * of a new card. This is a convenience method that combines these two actions
 * into one call.
 *
 * req body format:
 *
 * { 'cardset': 'cardsetName', 'algorithm': 'selectionAlgorithmToUse' ,
 *   'cardUpdate': { 'cardId': 'cardIdentifier', 'score': 1} }
*/ 
router.post('/report-get-next', function(req, res){

});


/**
 * Returns a random card from a random cardset. Mostly usefull for people
 * who are just bored and want to see some random stuff.
 *
*/ 
router.get('/get-random', function(req, res){

});


module.exports = router;
