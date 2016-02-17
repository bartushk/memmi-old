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

describe('mongo-phm, getCardSetById.', function(){

    it('When called with bad url, error passed.', function(done){
        var csm = new monCsm();
        var targetCardSet =  testData.getCardSet1();
        csm._url = "mongodb://doesnt_exist";
        csm.getCardSetById(targetCardSet.id, function(err, cardSet){
            should.exist(err);
            should.not.exist(cardSet);
            done();
        });
    });

    it('When card set exists, correct card set is returned.', function(done){
        var targetCardSet =  testData.getCardSet1();
        var csm = new monCsm();
        csm.getCardSetById(targetCardSet.id, function(err, result){
            should.not.exist(err);
            should.deepEqual(result, targetCardSet);
            done();
        });
    });


    it('When card set does not exist, error passed.', function(done){
        var csm = new monCsm(); 
        csm.getCardSetById('does not exit', function(err, result){
            should.exist(err);
            should.not.exist(result);
            done();
        });
    });

});


describe('mongo-csm, deactivateCardSetById.', function(){

    it('When given bad url, returns error and cardset is not deactivated', function(done){
        var csm = new monCsm();
        var targetCardSet =  testData.getCardSet1();
        csm._url = "mongodb://doesnt_exist";
        csm.deactivateCardSetById(targetCardSet.id, function(err, cardSet){
            should.exist(err);
            should.not.exist(cardSet);
            getCardset(targetCardSet.id, function(resultActive){
                should.exist(resultActive);
                getCardset(targetCardSet.id, function(resultInactive){
                    should.not.exist(resultInactive);
                    done();
                }, config.mongo.inactiveCardSetCollection); 
            });
        });
    });

    it('When card set does not exist, error thrown', function(done){
        var csm = new monCsm();
        csm.deactivateCardSetById('does not exist', function(err, cardSet){
            should.exist(err);
            should.not.exist(cardSet);
            done();
        });
    });

    it('When deactivated, cardset removed from active set and added to deactive set.', function(done){
        //Add cardset first to avoid mucking with other data.
        //TODO: Make this not dependent on add function.
        var csm = new monCsm();
        var targetCardSet = testData.getCardSet1();
        targetCardSet.id = new Date().getTime().toString() + '21';
        csm.addCardSet(targetCardSet, function(err, cardSet){
            delete targetCardSet._id;
            csm.deactivateCardSetById(targetCardSet.id, function(err, cardSet){
                should.deepEqual(cardSet, targetCardSet);
                getCardset(targetCardSet.id, function(resultActive){
                    should.not.exist(resultActive);
                    getCardset(targetCardSet.id, function(resultInactive){
                        should.exist(resultInactive);
                        should.deepEqual(resultInactive, targetCardSet);
                        done();
                    }, config.mongo.inactiveCardSetCollection); 
                });
            });
        });
    });

});
