var config = require('../config/config-factory').getConfig();
var express = require('express');
var router = express.Router();
var idProvider = require('../lib/auth/' + config.identityProvider || 'mock-identity-provider');

var identityProvider = new idProvider();

var _pages = [
    {title:'Play', link:'/'},
    {title:'Create', link:'/create'},
    {title:'About', link:'/about'}
];

router.get('/', function(req, res){
    identityProvider.getIdentity(req, function(err, identity){
        var initCardset = req.query.cardset || 'welcome';
        res.render('index', {title:'Memmi', pages:_pages, selected_index:0, identity:identity,  initialCardset:initCardset});
    });
});

router.get('/create', function(req, res){
    identityProvider.getIdentity(req, function(err, identity){
        res.render('create', {title:'Memmi - create', pages:_pages,  identity:identity, selected_index:1});
    });
});

router.get('/about', function(req, res){
    identityProvider.getIdentity(req, function(err, identity){
        res.render('about', {title:'Memmi - about', pages:_pages,  identity:identity, selected_index:2});
    });
});

module.exports = router;
