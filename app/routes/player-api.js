var config = require('../config/config-factory').getConfig();
var log = require('../lib/log-factory').getLogger();
var express = require('express');
var idProvider = require('../lib/auth/' + config.identityProvider || 'mock-identity-provider');


/**
 * Api for player related actions. Gets a player's
 * history for certain cardsets.
 *
*/ 

var router = express.Router();
var cardsetManager = require('../lib/csm/csm-factory').getCsm();
var playerHistory = require('../lib/phm/phm-factory').getPhm();
var identityProvider = new idProvider();


/**
 * This endpoint returns a palyer's history for a particular cardset.
 *      
 * req body format:
 * { 'cardset': 'cardsetName' }
*/ 
router.post('/history', function(req, res){
    var cardsetId = req.body.cardset;
    identityProvider.getIdentity(req, function(err, identity){
        playerHistory.getPlayerHistory(cardsetId, identity, function(err, playerHistory){
            if(err){
                log.warn(err);
                res.status(500).send("Error getting player history.");
                return;
            }
            res.send(playerHistory);
        });
    });
});


/**
 * Endpoint that accepts username/password info a login attempt.
 *
 * req body format:  
 * { 'username': 'providedUsername', 'pass': 'hashedPassword' }
*/ 

router.post('/login', function(req, res){
    var reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.info({body: req.body, ip: reqIp},  "Login Request Received."); 
    res.send({playerId: 'kyle', isAnon: false});
});

module.exports = router;
