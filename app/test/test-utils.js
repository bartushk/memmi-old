var supertest = require('supertest');
var app = require('../app');

/**
 * Since being logged in is important for lots of test,
 * this will run a login so you have the correct credentials
 * with any calls inside the callback.
 *
*/ 
module.exports.supertestLogin = function(callback){
    var agent = supertest.agent(app);
    agent.post('/player-api/login')
        .send({'username': 'doodie', 'pass': 'password'})
        .end(function(err, res){
            callback(err, agent);
        });
};
