var gulp = require('gulp');
var env = require('gulp-env');
var spawn = require('child_process').spawn; 
var exec = require('child_process').exec; 
var mocha = require('gulp-mocha');
var mon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var runSequence = require('gulp-run-sequence');
var _ = require('underscore');

var mochaOnError = function(err, stopMongo){
    if(err.stack){
        console.log(err);
        if(stopMongo)
            runSequence('mongo-stop', 'exit-bad');
    }
};

gulp.task('dev', function(){
    env({
        vars: {
            CONFIG: "dev"
        }
    });
});


gulp.task('dev-local', function(){
    env({
        vars: {
            CONFIG: "dev-local"
        }
    });
});

gulp.task('exit-good', function(){
    process.exit(0);
});

gulp.task('exit-bad', function(){
    process.exit(1);
});

gulp.task('test-all', function(cb){
    runSequence('test-basic', 'test-route', 'test-mongo', 'exit-good');
});

gulp.task('test-basic', function(cb){
    var error;
    env({vars:{CONFIG: "test-basic"}});
    gulp.src(['./test/basic/*.js'], {read: false})
        .pipe(mocha())
        .once('end', function(){
            if(error){
                console.log(error);
                process.exit(1);
            }
            cb();
        })
        .once('error', function(err){error = err; mochaOnError(err);});
});

gulp.task('test-route', function(cb){
    var error;
    env({vars:{CONFIG: "test-route"}});
    gulp.src(['./test/route/*.js'], {read: false})
        .pipe(mocha())
        .once('end', function(){
            if(error){
                console.log(error);
                process.exit(1);
            }
            cb();
        })
        .once('error', function(err){error = err; mochaOnError(err);});
});

gulp.task('test-mongo', ['mongo-start', 'set-mongo-env'],  function(cb){
    var error;
    env({vars:{CONFIG: "test-mongo"}});
    gulp.src(['./test/mongo/*.js'], {read: false})
        .pipe(mocha())
        .once('end', function(){
            runSequence('mongo-stop');
            if(error){
                console.log(error);
                process.exit(1);
            }
            cb();
        })
        .once('error', function(err){error = err; mochaOnError(err, true);});
});

gulp.task('browser-sync', function(){
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        port: 7000,
        notify: false,
    });
});

gulp.task('app', function(cb){
    var called = false;
    var bunyan = null;
    mon({
        script: './app.js',
        ext: 'js jade json',
        ignore: ['./node_modules'],
        stdout: false,
        readable: false
        })
    .on('start', function(){
        if(!called){
            called = true;
            cb();
        }
        _.delay(function(){
            browserSync.reload();
        }, 1000);
    })
    .on('readable', function(){
        bunyan = spawn('./node_modules/bunyan/bin/bunyan', [
            '--output', 'short', '--color'
        ]);

        bunyan.stdout.pipe(process.stdout);
        bunyan.stderr.pipe(process.stderr);

        this.stdout.pipe(bunyan.stdin);
        this.stderr.pipe(bunyan.stdin);
    });
});

gulp.task('set-mongo-env', function(){
    var mongo_url = "mongodb://localhost:27017";
    if( process.platform == 'darwin' )
        mongo_url = 'mongodb://192.168.99.100:27017';
    env({vars:{MONGO_URL: mongo_url}});
});

gulp.task('mongo-start', function(cb){
    var command = "";
    if( process.platform == 'darwin' )
        command += 'eval "$(docker-machine env default)" && ';
    command += 'docker run --name gulp-mongo -d -p 27017:27017  mongo';
    exec(command, function(err, stdout, stderr){
        if(err)
            console.log(err);
        console.log(stdout);
        cb();
    });        
});

gulp.task('mongo-stop', function(cb){
    var command = "";
    if( process.platform == 'darwin' )
        command += 'eval "$(docker-machine env default)" && ';
    command += 'docker stop gulp-mongo && docker rm -v gulp-mongo';
    exec(command, function(err, stdout, stderr){
        if(err)
            console.log(err);
        console.log(stdout);
        cb();
    });        
});

gulp.task('default', ['test-all']);

gulp.task('run', function(){
    runSequence('dev-local', 'app', 'browser-sync');
});
