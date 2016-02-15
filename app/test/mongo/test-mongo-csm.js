var should = require("should");
var config = require('../../config/config-factory').getConfig();
var monCsm = require('../../lib/csm/mongo-csm');
var _ = require('underscore');
var monUtil = require('../mongo-utils');
var mongoClient = require('mongodb').MongoClient;
var testData = require('../assets/test-data');

monUtil.initData();


function getCardset(cardSetId, callback, cName){
    var query = {id: cardSetId};
    var collectionName = cName || config.mongo.cardSetCollection;
    mongoClient.connect(config.mongo.url, function(err, db){
        if(err)
            console.log(err);
        var col = db.collection(collectionName);
        col.findOne(query, {_id: 0}, function(err, cardSet){
            if(err)
                console.log(err);
            callback(cardSet);
        });
    });
}

describe('mongo-csm, construction.', function(){
    it('When constructed, object exists.', function(){
        var csm = new monCsm();
        should.exist(csm);
    });

    it('When constructed, url, collections, and write options set from config.', function(){
        var csm = new monCsm();
        should.equal(csm._url, config.mongo.url);
        should.equal(csm._activeCollection, config.mongo.cardSetCollection);
        should.equal(csm._inactiveCollection, config.mongo.inactiveCardSetCollection);
        should.deepEqual(csm._writeOptions, config.mongo.writeOptions);
    });
});



describe('mongo-csm, addCardSet.', function(){
    it('When called with bad url, error passed.', function(done){
        var csm = new monCsm();
        var toAdd = testData.getCardSet1();
        toAdd.id = new Date().getTime().toString() + '1';
        csm._url = "mongodb://doesnt_exist";
        csm.addCardSet(toAdd, function(err, cardSet){
            should.exist(err);
            should.not.exist(cardSet);
            done();
        });
    });

    it('When cardset already exists, error passed.', function(done){
        var csm = new monCsm();
        csm.addCardSet(testData.getCardSet1(), function(err, cardSet){
            should.exist(err);
            should.not.exist(cardSet);
            done();
        });
    });

    it('When added, cardset passed to callback with no mongo _id.', function(done){
        var csm = new monCsm();
        var toAdd = testData.getCardSet1();
        toAdd.id = new Date().getTime().toString() + '2';
        csm.addCardSet(toAdd, function(err, cardSet){
            delete toAdd._id;
            should.not.exist(err);
            should.deepEqual(cardSet, toAdd);
            done();
        });
    });

    it('When added, cardset returned is a deep copy.', function(done){
        var csm = new monCsm();
        var toAdd = testData.getCardSet1();
        toAdd.id = new Date().getTime().toString() + '2';
        csm.addCardSet(toAdd, function(err, cardSet){
            delete toAdd._id;
            toAdd.test = 'asdfasdf';
            should.not.exist(err);
            should.notEqual(toAdd.test, cardSet.test);
            done();
        });
    });

    it('When added, cardset inserted into mongodb.', function(done){
        var csm = new monCsm();
        var toAdd = testData.getCardSet1();
        toAdd.id = new Date().getTime().toString() + '3';
        csm.addCardSet(toAdd, function(err, cardSet){
            delete toAdd._id;
            should.not.exist(err);
            getCardset(toAdd.id, function(mongoCardSet){
                should.deepEqual(mongoCardSet, toAdd);
                done();
            });
        });
    });
});
