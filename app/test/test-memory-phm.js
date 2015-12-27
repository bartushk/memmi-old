var should = require("should");
var _ = require("underscore");
var memPhm = require("../lib/phm/memory-phm");
var memCsm = require("../lib/csm/memory-csm");



describe('memory-phm construction', function(){
    it('When constructed, object exists.', function(){
        var phm = new memPhm();
        should.exist(phm);
    });

    it('When constructed, initial data set.', function(){
        var initData = {};
        initData.test = "hello";
        var phm = new memPhm(initData);
        should.equal(phm._playerHistory.test, "hello");
    });

    it('When constructed, passed csm set.', function(){
        var initCsm = {};
        initCsm.test = "hello";
        var phm = new memPhm(null, initCsm);
        should.equal(phm._csm.test, "hello");
    });

    it('When constructed, data defaulted to empty dict.', function(){
        var phm = new memPhm();
        should.deepEqual(_.keys(phm._playerHistory),[]);
    });

    it('When constructed, card set manager should default to MemoryCsm.', function(){
        var phm = new memPhm();
        (5).should.be.exactly(5);
        phm._csm.should.be.an.instanceof(memCsm);
    });
});
