var should = require("should");
var config = require('../../config/config-factory').getConfig();
var monStore = require('../../lib/auth/mongo-user-store');
var monUtil = require('../mongo-utils');
var testData = require('../assets/test-data');
var _ = require('underscore');
var mongoClient = require('mongodb').MongoClient;

before(function(done){
    monUtil.initData(function(){
        done();
    });
});

var existingPlayerId = 'bartushk';

function getUser(playerId, callback){
    var query = { playerId: playerId };
    mongoClient.connect(config.mongo.url, function(err, db){
        if(err)
            console.log(err);
        var col = db.collection(config.mongo.userCollection);
        col.findOne(query, {_id: 0}, function(err, userData){
            if(err)
                console.log(err);
            callback(userData);
        });
    });
}

describe('mongo-user-store, construction', function(){

    it('When constructed, object exists.', function(){
        var store =  new monStore();
        should.exist(store);
    });

    it('When constructed, url, collection and write options set from config.', function(){
        var store = new monStore();  
        should.equal(store._url, config.mongo.url);
        should.equal(store._collection, config.mongo.userCollection);
        should.deepEqual(store._writeOptions, config.mongo.writeOptions);
    });

});


describe('mongo-user-store, getUserData', function(){
    it('When bad url used, error passed.', function(done){
        var store = new monStore();
        store._url = "mongodb://doesnt_exist";
        store.getUserData(existingPlayerId, function(err, userData){
            should.exist(err);
            should.not.exist(userData);
            done();
        });
    });

    it('When user does not exist, error passed.', function(done){
        var store = new monStore();
        store.getUserData('doesnt exist', function(err, userData){
            should.exist(err);
            should.not.exist(userData);
            done();
        });
    });

    it('When user exists, user data returned.', function(done){
        var userData = testData.getUserStore(); 
        var targetUser = userData[existingPlayerId];
        var store = new monStore();
        store.getUserData(existingPlayerId, function(err, userData){
            should.not.exist(err);
            should.deepEqual(userData, targetUser);
            done();
        });
    });

});

describe('mongo-user-store, addUser', function(){

    it('When player already exists, error passed mongodb not updated', function(done){
        var newUser = {playerId: 'bartushk'};
        var store = new monStore();
        store.addUser(newUser, function(err, addedUser){
            should.exist(err);
            should.not.exist(addedUser);
            getUser(newUser.playerId, function(user){
                should.exist(user);
                should.exist(user.firstName);
                done();
            });
        });
    });

    it('When new player added, user now in mongodb.', function(done){
        var newUser = testData.getUserStore().bartushk; 
        newUser.playerId = "something_new1";
        var store = new monStore();
        store.addUser(newUser, function(err, addedUser){
            should.not.exist(err);
            should.exist(addedUser);
            getUser(newUser.playerId, function(user){
                should.deepEqual(user, newUser);
                done();
            });
        });
    });

    it('When new player added, passed user is deep copy.', function(done){
        var newUser = testData.getUserStore().bartushk; 
        newUser.playerId = "something_new2";
        var store = new monStore();
        store.addUser(newUser, function(err, addedUser){
            newUser.test = 'asdf';
            should.notEqual(newUser.test, addedUser.test);
            done();
        });
    });

});
