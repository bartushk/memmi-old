var should = require("should");
var config = require('../../config/config-factory').getConfig();
var monPhm = require('../../lib/phm/mongo-phm');
var monUtil = require('../mongo-utils');

monUtil.initData();

describe('mongo-phm, construction.', function(){

    it('When constructed, object exists.', function(){
        var phm = new monPhm();
        should.exist(phm);
    });

    it('When constructed, csm set correctly when passed.', function(){
        var phm = new monPhm(true);
        should.equal(true, phm._csm);
    });

    it('When constructed, url and collection set from config.', function(){
        var phm = new monPhm();  
        should.equal(phm._url, config.mongo.url);
        should.equal(phm._collection, config.mongo.historyCollection);
    });

});


