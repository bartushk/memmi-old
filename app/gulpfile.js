var gulp = require('gulp');
var env = require('gulp-env');
var spawn = require('child_process').spawn; 
var exec = require('child_process').exec; 
var mocha = require('gulp-mocha');
var mon = require('gulp-nodemon');
var exit = require('gulp-exit');
var browserSync = require('browser-sync');
var _ = require('underscore');

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

gulp.task('test', function(){
    gulp.src(['./test/*.js'], {read: false})
        .pipe(mocha()).pipe(exit());
});

gulp.task('browser-sync', function(){
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        port: 7000,
        notify: false
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

gulp.task('default', ['test']);

gulp.task('run', ['dev-local', 'app', 'browser-sync']);
