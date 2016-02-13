var should = require("should");
var monPhm = require('../../lib/phm/mongo-phm');
var monUtil = require('../mongo-utils');

monUtil.initData();


describe('mongo-phm, construction.', function(){
    it('When constructed, object exists.', function(){
        var phm = new monPhm();
        should.exist(phm);
    });
});


