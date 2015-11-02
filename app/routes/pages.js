var express = require('express');
var router = express.Router();

var _pages = [
    {title:'Home', link:'/'},
    {title:'Play', link:'/play'},
    {title:'About', link:'/about'}
]

router.get('/', function(req, res){
   res.render('index', {title:'Memmi - home', pages:_pages, selected_index:0});
});

router.get('/play', function(req, res){
    res.render('play', {title:'Memmi - play', pages:_pages, selected_index:1});
});

router.get('/about', function(req, res){
    res.render('about', {title:'Memmi - about', pages:_pages, selected_index:2});
});

module.exports = router;