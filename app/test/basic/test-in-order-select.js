var should = require("should");
var inSelect = require("../../lib/selection/in-order-select");
var testData = require("../assets/test-data");


describe('in-order-select construction.', function(){
    it('When constructed, object exists.', function(){
        var select = new inSelect();
        should.exist(select);
    });
});
