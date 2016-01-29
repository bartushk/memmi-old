var config = require('../../config/config-factory').getConfig();
var should = require('should');
var _ = require('underscore');
var supertest = require('supertest');
var app = require('../../app');
var testUsers = require('../assets/test-data').getUserStore();

var bodyNoPass = {'username': 'bartushk'};
var bodyNoUser = {'pass': 'password'};
var bodyBadUser = {'username': 'asdfasdf', 'pass': 'asdfasdf'};
var bodyBadPass = {'username': 'doodie', 'pass': 'huaimao'};
var bodyGood = {'username': 'doodie', 'pass': 'password'};
var loginRoute = '/player-api/login';

describe('player-api, login.', function(){

    it('When post has empty body, 400 returned.', function(done){
        supertest(app)
            .post(loginRoute)
            .send({})
            .expect(400, done);
    });
    
    it('When post does not have username, 400 returned.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyNoUser)
            .expect(400, done);
    });

    it('When post does not have password, 400 returned.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyNoPass)
            .expect(400, done);
    });

    it('When user does not exist, 404 returned.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyBadUser)
            .expect(404, done);
    });

    it('When password does not mach, 404 returned.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyBadPass)
            .expect(404, done);
    });

    it('When good login, 200 returned.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyGood)
            .expect(200, done);
    });

    it('When good login, response contains full user.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyGood)
            .expect(200)
            .end(function(err,res){
                should.equal(bodyGood.username, res.body.playerId); 
                should.equal(testUsers[bodyGood.username].email, res.body.email);
                done();
            });
    });

    it('When good login, pass data removed.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyGood)
            .expect(200)
            .end(function(err,res){
                should.not.exist(res.body.pass);
                done();
            });
    });

    it('When good login, cookie set on response.', function(done){
        supertest(app)
            .post(loginRoute)
            .send(bodyGood)
            .expect(200)
            .end(function(err,res){
                should.exist(res.headers['set-cookie'][0]);
                res.headers['set-cookie'][0].should.containEql(config.sessionName);
                done();
            });
    });
});
