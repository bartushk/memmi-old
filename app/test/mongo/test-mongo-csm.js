var should = require("should");
var config = require('../../config/config-factory').getConfig();
var monCsm = require('../../lib/csm/mongo-csm');
var _ = require('underscore');
var monUtil = require('../mongo-utils');

monUtil.initData();


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
        should.equal(JSON.stringify(csm._writeOptions), JSON.stringify(config.mongo.writeOptions));
    });
});
