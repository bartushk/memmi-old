var should = require('should');
var _ = require('underscore');
var memCsm = require('../../lib/csm/memory-csm');
var testData = require('../assets/test-data');
var fakeCardSet = testData.getCardSet1();
var cardsetName = 'cardset1';

describe('memory-csm construction', function(){
	it('When constructed, object exists.', function(){
		var csm = new memCsm();
		should.exist(csm);
	});

	it('When constructed no data, data empty.', function(){
		var csm = new memCsm();
		csm._data.should.be.empty();
	});

	it('Constructed with Initial Data.', function(){
		var initData = {};
		initData.test1 = 123123;
		initData.test2 = '123123';
		var csm = new memCsm(initData);
		
		should.equal(initData.test1, csm._data.test1);
		should.equal(initData.test2, csm._data.test2);

	});
});



describe('Memory CSM addCardSet', function(){
	it('When added, cardSet is saved by Id.', function(){
		var csm = new memCsm({});
		csm.addCardSet(fakeCardSet);
		should.exist(csm._data[cardsetName]);
	});

	it('When validly added, cardset passed to callback.', function(done){
		var csm = new memCsm({});
		csm.addCardSet(fakeCardSet, function(error, cardSet){
			should.equal(fakeCardSet.id, cardSet.id);
			done();
		});
	});

	it('When validly added, cardset passed no error.', function(done){
		var csm = new memCsm({});
		csm.addCardSet({}, function(error, cardSet){
			should.not.exist(error);
			done();
		});
	});

	it('When validly added, added date added.', function(done){
		var csm = new memCsm({});
		csm.addCardSet({}, function(error, cardSet){
			should.ok(cardSet._addedDate.getTime() - new Date().getTime() < 1000);
			done();
		});
	});
});


describe('Memory CSM deactivateCardSet.', function(){
	it('When validly deactivated, card set is moved to inactiveSets.', function(done){
                var testSet = {};
                testSet[cardsetName] = fakeCardSet;
                var csm = new memCsm(testSet);
		csm.deactivateCardSet(fakeCardSet, function(err, cardSet){
			csm._inactiveSets.should.have.key(cardsetName);
			done();
		}); 	
	});

	it('When validly deactivated, error should not exist.', function(done){
                var testSet = {};
                testSet[cardsetName] = fakeCardSet;
                var csm = new memCsm(testSet);
		csm.deactivateCardSet(fakeCardSet, function(err, cardSet){
                        should.not.exist(err);
			done();
		}); 	
	});

        it('When card set does not exist, error thrown.', function(done){
		var csm = new memCsm({'weird_name': fakeCardSet});
		csm.deactivateCardSet(fakeCardSet, function(err, cardSet){
                        should.exist(err);
			done();
		}); 	
        });
});

describe('Memory CSM deactivateCardSetById.', function(){
	it('When validly deactivated, card set is moved to inactiveSets.', function(done){
                var testSet = {};
                testSet[cardsetName] = fakeCardSet;
		var csm = new memCsm( testSet );
		csm.deactivateCardSetById(cardsetName, function(err, cardSet){
			csm._inactiveSets.should.have.key(cardsetName);
			done();
		}); 	
	});

	it('When validly deactivated, error should not exist.', function(done){
                var testSet = {};
                testSet[cardsetName] = fakeCardSet;
		var csm = new memCsm( testSet );
		csm.deactivateCardSetById(cardsetName, function(err, cardSet){
                        should.not.exist(err);
			done();
		}); 	
	});

        it('When card set does not exist, error thrown.', function(done){
		var csm = new memCsm({'weird_name': fakeCardSet});
		csm.deactivateCardSetById(cardsetName, function(err, cardSet){
                        should.exist(err);
			done();
		}); 	
        });
});


describe('Memory CSM getCardSetById', function(){

    it('When card set exists, correct card set returned.', function(done){
        var testSet = {};
        testSet[cardsetName] = fakeCardSet;
        var csm = new memCsm(testSet);
        csm.getCardSetById(cardsetName, function(err, cardSet){
                cardSet.id.should.equal(cardsetName);
                done();
        }); 	
    });

    it('When card set exists, error is not thrown.', function(done){
        var testSet = {};
        testSet[cardsetName] = fakeCardSet;
        var csm = new memCsm(testSet);
        csm.getCardSetById(cardsetName, function(err, cardSet){
                should.not.exist(err);
                done();
        }); 	
    });

    it('When card set does not exist, error thrown', function(done){
        var testSet = {};
        testSet[cardsetName] = fakeCardSet;
        var csm = new memCsm(testSet);
        csm.getCardSetById('DerpDogOct', function(err, cardSet){
                should.exist(err);
                done();
        }); 	
    });

});

describe('Memory CSM getAvailableCardSets.', function(){
    it('When called, returns all available sets.', function(done){
        var fakeSet = {
            'test_id1': {},
            'test_id2': {},
            'test_id3': {},
            'test_id4': {}
        };
        var csm = new memCsm(fakeSet);
        csm.getAvailableCardSets(function(err, cardSet){
            should.deepEqual(cardSet, _.keys(fakeSet));
            done();
        }); 	
    });

    it('When called, error is null', function(done){
        var csm = new memCsm({});
        csm.getAvailableCardSets(function(err, cardSet){
            should.not.exist(err);
            done();
        }); 	
    });
});
