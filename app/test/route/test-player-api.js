var config = require('../../config/config-factory').getConfig();
var should = require('should');
var _ = require('underscore');
var supertest = require('supertest');
var app = require('../../app');
var testUsers = require('../assets/test-data').getUserStore();
var supertestLogin = require('../test-utils').supertestLogin;

var bodyNoPass = {'username': 'bartushk'};
var bodyNoUser = {'pass': 'password'};
var bodyBadUser = {'username': 'asdfasdf', 'pass': 'asdfasdf'};
var bodyBadPass = {'username': 'doodie', 'pass': 'huaimao'};
var bodyGood = {'username': 'doodie', 'pass': 'password'};

var goodId = {};
goodId[config.sessionName] = {'playerId': 'bartushk'};

var loginRoute = '/player-api/login';
var historyRoute = '/player-api/history';

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

    it('When password does not match, 404 returned.', function(done){
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
                should.not.exist(err);
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
                should.not.exist(err);
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
                should.not.exist(err);
                should.exist(res.headers['set-cookie'][0]);
                res.headers['set-cookie'][0].should.containEql(config.sessionName);
                done();
            });
    });
});

describe('player-api, history.', function(){
    it('When post body does not contain cardset string, return 400.', function(done){
        supertest(app)
            .post(historyRoute)
            .send({'cardset': 100})
            .expect(400, done);
    });

    it('When player is anonymous, blank history returned.', function(done){
        supertest(app)
            .post(historyRoute)
            .send({'cardset': 'cardset1'})
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                should.equal(res.body._playIndex, 0);
                done();
            });
    });

    it('When identity good and cardset correct, proper history returned.', function(done){
        supertestLogin(function(err, agent){
            should.not.exist(err);
            agent.post(historyRoute)
                .send({'cardset': '__test_only'})
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    should.equal(res.body._playIndex, 1);
                    done();
                });
        });
    });

    it('When identity good and no history, blank history returned.', function(done){
        supertestLogin(function(err, agent){
            should.not.exist(err);
            agent.post(historyRoute)
                .send({'cardset': 'cardset2'})
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    should.equal(res.body._playIndex, 0);
                    done();
                });
        });
    });

    it('When identity good and cardset does not exist, 404 returned.', function(done){
        supertestLogin(function(err, agent){
            should.not.exist(err);
            agent.post(historyRoute)
                .send({'cardset': 'doesnt_exist'})
                .expect(404, done);
        });
    });
});
