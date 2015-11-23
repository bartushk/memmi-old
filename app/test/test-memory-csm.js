var should = require('should');
var _ = require('underscore');
var memCsm = require('../lib/memory-csm');
var fakeFailValidator = {};
var fakePassValidator = {};
fakeFailValidator.validate = function(){};
fakeFailValidator.ok = "Not okay.";
fakePassValidator.validate = function(){return "Okay!";};
fakePassValidator.ok = "Okay!";
fakeCardSet = {
	'id':'test_id'
};

describe('memory-csm construction', function(){
	it('When constructed, object exists.', function(){
		var csm = new memCsm();
		should.exist(csm);
	});

	it('When constructed no data, data empty.', function(){
		var csm = new memCsm();
		csm._data.should.be.empty();
	});

	it('Constructed with Inital Data.', function(){
		var initData = {};
		initData.test1 = 123123;
		initData.test2 = '123123';
		var csm = new memCsm(initData);
		
		should.equal(initData.test1, csm._data.test1);
		should.equal(initData.test2, csm._data.test2);

	});
});



describe('Memory CSM addCardSet', function(){
	it('When validly added, cardSet is saved by Id.', function(){
		var csm = new memCsm({}, fakePassValidator);
		csm.addCardSet(fakeCardSet);
		should.exist(csm._data.test_id);
	});
	
	it('When card not validated, error passed to callback.', function(done){
		var csm = new memCsm({}, fakeFailValidator);
		csm.addCardSet({}, function(error, cardSet){
			should.exist(error);
			done();
		});
	});

	it('When card not validated, cardSet passed to callback.', function(done){
		var csm = new memCsm({}, fakeFailValidator);
		csm.addCardSet(fakeCardSet, function(error, cardSet){
			should.equal(fakeCardSet.id, cardSet.id);
			done();
		});
	});

	it('When validly added, cardset passed to callback.', function(done){
		var csm = new memCsm({}, fakePassValidator);
		csm.addCardSet(fakeCardSet, function(error, cardSet){
			should.equal(fakeCardSet.id, cardSet.id);
			done();
		});
	});

	it('When validly added, cardset passed no error.', function(done){
		var csm = new memCsm({}, fakePassValidator);
		csm.addCardSet({}, function(error, cardSet){
			should.not.exist(error);
			done();
		});
	});
});
