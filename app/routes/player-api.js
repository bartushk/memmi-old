var config = require('../config/config-factory').getConfig();
var log = require('../lib/log-factory').getLogger();
var express = require('express');
var idProvider = require('../lib/auth/' + (config.identityProvider || 'mock-identity-provider'));
var bcrypt = require('bcryptjs');
var _ = require('underscore');


/**
 * Api for player related actions. Gets a player's
 * history for certain cardsets.
 *
*/ 

var router = express.Router();
var cardsetManager = require('../lib/csm/csm-factory').getCsm();
var playerHistory = require('../lib/phm/phm-factory').getPhm();
var userStore = require('../lib/auth/user-store-factory').getUserStore();
var identityProvider = new idProvider();


/**
 * This endpoint returns a palyer's history for a particular cardset.
 *      
 * req body format:
 * { 'cardset': 'cardsetName' }
*/ 
router.post('/history', function(req, res){
    var cardsetId = req.body.cardset;
    if( !_.isString(cardsetId) ){
        res.status(400).send("Incorrect post body format.");
        return;
    }
    identityProvider.getIdentity(req, function(err, identity){
        playerHistory.getPlayerHistory(cardsetId, identity, function(err, playerHistory){
            if(err){
                log.warn(err);
                res.status(404).send("Error getting player history.");
                return;
            }
            res.send(playerHistory);
        });
    });
});


/**
 * Endpoint that accepts username/password info for a login attempt.
 *
 * req body format:  
 * { 'username': 'providedUsername', 'pass': 'hashedPassword' }
*/ 

router.post('/login', function(req, res){
    var reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.info({body: req.body, ip: reqIp},  "Login Request Received."); 
    if( !_.isString(req.body.username) || !_.isString(req.body.pass) ){
        res.status(400).send("Incorrect post body format.");
        return;
    }
    userStore.getUserData(req.body.username, function(err, userData){
        if(err){
            log.info(err);
            res.status(404).send("Username not found.");
            return;
        }
        bcrypt.compare(req.body.pass, userData.pass, function(err, result){
            if(!result){
                log.info(req.body, "Incorrect password given.");
                res.status(404).send("Error validating password.");
                return;
            }else{
                delete userData.pass;
                req[config.sessionName] = userData; 
                res.send(userData);
            }
        });
    });
});

module.exports = router;
