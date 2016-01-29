var should = require("should");
var _ = require("underscore");
var config = require("../../config/config-factory").getConfig();
var identityProvider = require('../../lib/auth/client-identity-provider');

var reqObjectWithId = {};
reqObjectWithId[config.sessionName] = {
    'playerId': 'bartushk', 
    'testKey': 'testValue'
};

var reqObjectWithoutId = {};
reqObjectWithoutId[config.sessionName] = {
    'testKey': 'testValue'
};


describe('client-identity-provider construction.', function(){
    it('When constructed, object exists.', function(){
        var clientId = new identityProvider();
        should.exist(clientId);
    });

    it('When constructed, cookie name initialized from config.', function(){
        var clientId = new identityProvider();
        should.equal(config.sessionName, clientId._cookieName);
    });
});


describe('client-identity-provider, getIdentity.', function(){
    it('When cookie session cookie not populated, return anonymous.', function(done){
        var clientId = new identityProvider();
        clientId.getIdentity({}, function(err, userId){
            should.not.exist(err);
            should.equal(userId.isAnon, true);
            done();
        });
    });

    it('When cookie exists with no player Id, return anonymous.', function(done){
        var clientId = new identityProvider();
        clientId.getIdentity(reqObjectWithoutId, function(err, userId){
            should.not.exist(err);
            should.equal(userId.isAnon, true);
            done();
        });
    });

    it('When cookie exists with playerId, returns full player information.', function(done){
        var clientId = new identityProvider();
        var testId = reqObjectWithId[config.sessionName];
        clientId.getIdentity(reqObjectWithId, function(err, userId){
            should.not.exist(err);
            should.equal(userId.isAnon, false);
            should.equal(userId.playerId, testId.playerId);
            should.equal(userId.testKey, testId.testKey);
            done();
        });
    });

    it('When cookie exists with playerId, deep copy of player identity is returned.', function(done){
        var clientId = new identityProvider();
        var testId = reqObjectWithId[config.sessionName];
        clientId.getIdentity(reqObjectWithId, function(err, userId){
            userId.testKey = 'updatedValue';
            should.not.exist(err);
            should.equal(userId.isAnon, false);
            should.equal(userId.playerId, testId.playerId);
            userId.testKey.should.not.equal(testId.testKey);
            done();
        });
    });
});
