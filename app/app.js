var express = require('express');
var favicon = require('serve-favicon');

var app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));


app.get('/', function (req, res) {
    res.send('Hello World!');
});



var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
