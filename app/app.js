var cluster = require('cluster');
var log = require('./lib/log-factory').getLogger();
var mode = process.env.MODE;

if(cluster.isMaster && mode == 'prod'){

    var cpuCount = require('os').cpus().length;
    log.info("CPU count: %s", cpuCount);
    for( var i = 0; i < cpuCount; i += 1 ){
        cluster.fork();
    }

    cluster.on('exit', function(worker){
        log.info('Worker %s exited :P', worker.id);
        cluster.fork();
    });
} else {
    var id = mode == 'prod' ? cluster.worker.id: 1;
    var express = require('express');
    var favicon = require('serve-favicon');
    var bodyParser = require('body-parser');
    var app = express();

    //Setup routes.
    var pages = require('./routes/pages');
    var cardApi = require('./routes/card-api.js');
    var path = require('path');


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon(__dirname + '/public/images/favicon.ico'));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    if( process.env.LOG_LEVEL == 'debug' ){
        require('./lib/log-factory').setLogLevel('debug');
        var logFunc = function(req, res, next){
            log.info({body: req.body}, 'Incoming Request.');
            next();
        };
        app.use(logFunc);
    }    

    app.use('/', pages);
    app.use('/card-api', cardApi);


    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        log.info('Worker %s listening at http://%s:%s', id,  host, port);
    });
}
