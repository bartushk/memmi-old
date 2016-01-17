var config = require('./config/config-factory').getConfig();
var cluster = require('cluster');
var log = require('./lib/log-factory').getLogger();

if(cluster.isMaster && config.multiProcess){

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
    var id = config.multiProcess ? cluster.worker.id: 1;
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

    if( config.logLevel == 'debug' || config.logLevel == 'trace' ){
        var logFunc = function(req, res, next){
            var oldWrite = res.write;
            var oldEnd = res.end;
            var chunks = [];
            res.write = function(chunk){
                if(chunk)
                    chunks.push(new Buffer(chunk));
                oldWrite.apply(res, arguments);
            };

            res.end = function(chunk){
                if(chunk)
                    chunks.push(new Buffer(chunk));
                if(chunks.length < 1){
                    log.debug({body: ""}, 'Response.');
                }else{
                    var body = Buffer.concat(chunks).toString('utf8');
                    log.debug({body: body}, 'Response.');
                }
                oldEnd.apply(res, arguments);
            };

            log.debug({body: req.body, url: req.url, method: req.method}, 'Request.');
            next();
        };
        app.use(logFunc);
    }    

    app.use('/', pages);
    app.use('/card-api', cardApi);


    var server = app.listen(config.port || 3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        log.info('Worker %s listening at http://%s:%s', id,  host, port);
    });
}
