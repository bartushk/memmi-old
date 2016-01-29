var should = require('should');
var _ = require('underscore');
var supertest = require('supertest');
var app = require('../../app');

var bodyNoPass = {'username': 'bartushk'};
var bodyNoUser = {'pass': 'password'};
var bodyGood = {'username': 'bartushk', 'pass': 'password'};

describe('player-api, login.', function(){

    it('When post has empty body, 400 returned.', function(done){
        supertest(app)
            .post('/player-api/login')
            .send({})
            .expect(400, done);
    });
    
    it('When post does not have username, 400 returned.', function(done){
        supertest(app)
            .post('/player-api/login')
            .send(bodyNoUser)
            .expect(400, done);
    });

    it('When post does not have password, 400 returned.', function(done){
        supertest(app)
            .post('/player-api/login')
            .send(bodyNoPass)
            .expect(400, done);
    });
});
