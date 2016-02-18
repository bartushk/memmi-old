var should = require('should');
var _ = require('underscore');
var memStore = require('../../lib/auth/memory-user-store');
var testData = require('../assets/test-data');


describe('memory-user-store construction.', function(){

    it('When constructed, object exists', function(){
        var store = new memStore();
        should.exist(store);
    });

    it('When constructed no data, data empty.', function(){
            var store = new memStore();
            store._users.should.be.empty();
    });

    it('Constructed with Initial Data.', function(){
            var initData = {};
            initData.test1 = 123123;
            initData.test2 = '123123';
            var store = new memStore(initData);
            
            should.equal(initData.test1, store._users.test1);
            should.equal(initData.test2, store._users.test2);
    });
});


describe('memory-user-store, getUserData', function(){
    it('When user does not exist, error passed.', function(done){
        var userData = testData.getUserStore(); 
        var store = new memStore(userData);
        store.getUserData('does not exist', function(err, userData){
            should.exist(err);
            should.not.exist(userData);
            done();
        });
    });

    it('When user exists, user data returned.', function(done){
        var userData = testData.getUserStore(); 
        var targetUser = userData.bartushk;
        var store = new memStore(userData);
        store.getUserData(targetUser.playerId, function(err, userData){
            should.not.exist(err);
            should.deepEqual(userData, targetUser);
            done();
        });
    });

    it('When user returned, user data is deep copy.', function(done){
        var userData = testData.getUserStore(); 
        var targetUser = userData.bartushk;
        var store = new memStore(userData);
        store.getUserData(targetUser.playerId, function(err, userData){
            targetUser.test = 'asdf';
            should.notEqual(userData.test, targetUser.test);
            done();
        });
    });
});
