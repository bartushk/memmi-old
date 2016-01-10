var cluster = require('cluster');


if(cluster.isMaster){

    //var cpuCount = require('os').cpus().length;
    var cpuCount = 2;
    console.log("CPU count: %s", cpuCount);
    for( var i = 0; i < cpuCount; i += 1 ){
        cluster.fork();
    }

    cluster.on('exit', function(worker){
        console.log('Worker %s exited :P', worker.id);
        cluster.fork();
    });
} else {
    var express = require('express');
    var favicon = require('serve-favicon');
    var bodyParser = require('body-parser');


    //Setup routes.
    var pages = require('./routes/pages');
    var cardApi = require('./routes/card-api.js');
    var path = require('path');

    var app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon(__dirname + '/public/images/favicon.ico'));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', pages);
    app.use('/card-api', cardApi);


    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Worker %s listening at http://%s:%s', cluster.worker.id,  host, port);
    });
}
