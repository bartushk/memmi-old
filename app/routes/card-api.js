var config = require('../config/config-factory').getConfig();
var log = require('../lib/log-factory').getLogger();
var express = require('express');
var selectionFactory = require('../lib/selection/selection-factory');
var idProvider = require('../lib/auth/' + (config.identityProvider || 'mock-identity-provider'));
var validator = require('../lib/validators/card-api');


/**
 * Api for card related actions. Allows someone to
 * get the next card for a certain set and report on
 * cards.
 *
*/ 

var router = express.Router();
var cardsetManager = require('../lib/csm/csm-factory').getCsm();
var playerHistory = require('../lib/phm/phm-factory').getPhm();
var identityProvider = new idProvider();


/**
 * Gets the next card from a cardset for a particular player using
 * the specified algorithm.
 *
 * @param {string} cardsetId 
 * @param {string} algorithmName 
 * @param {string} playerIdentity 
 * @param {Function} callback - callback(err,card)
 * @return {null}
*/ 
function getNextCard(cardsetId, algorithmName, playerIdentity, callback){
    var selection = selectionFactory.getSelectionAlgorithm(algorithmName);
    if(!selection){
        log.warn("Method of selection not found: " + algorithmName);
        callback(new Error("Could not find method of selection : " + algorithmName)); 
        return;
    }
    playerHistory.getPlayerHistory(cardsetId, playerIdentity, function(err, history){
        if(err){ callback(err); return;}
        selection.selectCard(history, function(err, cardName){
            if(err){ callback(err); return;}
            cardsetManager.getCardSetById(cardsetId, function(err, cardSet){
                if(err){ callback(err); return;}
                var requestReply = cardSet.cards[cardName];
                callback(null, cardSet.cards[cardName]);
            });
        });
    });
}


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
    if(!validator('get-next', req.body)){
        res.status(400).send("Malformed request.");
        return;
    }
    var cardsetId = req.body.cardset;
    var selectionAlgorithm = req.body.algorithm;
    identityProvider.getIdentity(req, function(err, identity){
        getNextCard(cardsetId, selectionAlgorithm, identity, function(err, card){
            if(err){
                log.warn(err);
                res.status(400).send("An error occured selecting the next card.");
                return;
            }
            var responseBody = {};
            responseBody.card = card;
            res.send(responseBody);
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
 * { 'cardset': 'cardsetName', 'cardUpdate': { 'cardId': 'cardIdentifier', 'score': 1} }
*/ 
router.post('/report', function(req, res){
    if(!validator('report', req.body)){
        res.status(400).send("Malformed request.");
        return;
    }
    var cardsetId = req.body.cardset;
    var cardUpdate = req.body.cardUpdate;
    identityProvider.getIdentity(req, function(err, identity){
        playerHistory.updateCardScore(cardsetId, identity, cardUpdate, function(err){
            if(err){
                log.warn(err);
                res.status(400).send("An error occured applying your card update.");
                return;
            }
            res.send("Update successfull");
        });
    });
});


/**
 * The typical usage will be a report, then the immediate presentation
 * of a new card. This is a convenience method that combines these two actions
 * into one call.
 *
 * req body format:
 *
 * { 'cardset': 'cardsetName', 'algorithm': 'selectionAlgorithmToUse' ,
 *   'cardUpdate': { 'cardId': 'cardIdentifier', 'score': 1, 'play_index': 100} }
*/ 
router.post('/report-get-next', function(req, res){
    if(!validator('report-get-next', req.body)){
        res.status(400).send("Malformed request.");
        return;
    }
    var cardsetId = req.body.cardset;
    var selectionAlgorithm = req.body.algorithm;
    var cardUpdate = req.body.cardUpdate;
    identityProvider.getIdentity(req, function(err, identity){
        playerHistory.updateCardScore(cardsetId, identity, cardUpdate, function(err){
            var updateSuccess = true;
            if(err){
                updateSuccess = false;
                log.warn(err);
            }
            getNextCard(cardsetId, selectionAlgorithm, identity, function(err, card){
                if(err){
                    log.warn(err);
                    res.status(400).send("An error occured selecting the next card.");
                    return;
                }
                var responseBody = {};
                responseBody.card = card;
                responseBody.updateSuccess = updateSuccess;
                res.send(responseBody);
            });
        });
    });
});


/**
 * Returns a random card from a random cardset. Mostly usefull for people
 * who are just bored and want to see some random stuff.
 *
*/ 
router.get('/get-random', function(req, res){

});


module.exports = router;
