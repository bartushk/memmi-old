var express = require('express');
var router = express.Router();

var _pages = [
    {title:'Play', link:'/'},
    {title:'Create', link:'/create'},
    {title:'About', link:'/about'}
];

router.get('/', function(req, res){
   res.render('index', {title:'Memmi - play', pages:_pages, selected_index:0});
});

router.get('/create', function(req, res){
    res.render('create', {title:'Memmi - create', pages:_pages, selected_index:1});
});

router.get('/about', function(req, res){
    res.render('about', {title:'Memmi - about', pages:_pages, selected_index:2});
});

module.exports = router;
