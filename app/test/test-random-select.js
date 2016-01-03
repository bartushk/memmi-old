var should = require("should");
var randSelect = require("../lib/selection/random-select");


describe('random-select construction.', function(){
    it('When constructed, object exists.', function(){
        var select = new randSelect();
        should.exist(select);
    });
});


