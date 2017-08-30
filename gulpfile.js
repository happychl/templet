var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var bs = require('browser-sync').create();
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var config = Object.create(webpackConfig);
var devCompiler = webpack(config);

var appSrc = 'src/app/',
    scriptSrc = 'src/script/',
    scriptDist = 'dist/script/',
    styleSrc = 'src/style/',
    styleDist = 'dist/style/',
    imgSrc = 'src/image/',
    imgDist = 'dist/image/',
    webDist = 'dist/';

var notify = {
    errorHandler: $.notify.onError({
        title: 'compile error',
        message: '<%=error.message %>'
    })
};

gulp.task('jade', function() {
    return gulp.src(appSrc + '**/*.jade')
        .pipe($.plumber(notify))
        .pipe($.jade({ pretty: true }))
        .pipe($.rename({ extname: ".blade.php" }))
        .pipe(gulp.dest(appSrc))
        .pipe(bs.stream())
});

gulp.task('sass', function() {
    var timestamp = Date.now();
    return gulp.src(styleSrc + '**/*.scss')
        .pipe($.plumber(notify))
        .pipe($.sourcemaps.init())
        .pipe($.sass({ outputStyle: 'expanded' }))
        .pipe($.sourcemaps.write({ includeContent: false }))
        .pipe($.autoprefixer('>5%', 'ie 8'))
        .pipe($.cssSpriter({
            'spriteSheet': imgDist + 'sprite.png',
            'pathToSpriteSheetFromCSS': '../../image/sprite.png'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(styleDist))
        .pipe(bs.stream())
});

gulp.task('min:css', ['sass'], function() {
    return gulp.src(styleDist + '**/*.css')
        .pipe($.minifyCss())
        .pipe(gulp.dest(styleDist))
});

gulp.task('build-js', function(callback) {
    devCompiler.run(function(err, stats) {
        if (err) throw new $.util.PluginError("webpack:build-js", err);
        $.util.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('js', ['build-js'], function() {
    return gulp.src(scriptDist + '*.js')
        .pipe(bs.stream())
});

gulp.task('min:js', ['js'], function() {
    return gulp.src(scriptDist + '*.js')
        .pipe($.uglify({ mangle: { except: ['require', 'exports', 'module', '$'] } }))
        .pipe(gulp.dest(scriptDist))
});

gulp.task('img', function() {
    return gulp.src(imgSrc + '**/*.{jpg,jpeg,gif,png}')
        .pipe(gulp.dest(imgDist))
});

gulp.task("clean", function() {
    return gulp.src(webDist + '**/*.map')
        .pipe($.clean())
});

gulp.task('server', function() {
    bs.init({
        // server: "./",
        proxy: 'localhost:8000',
        port: 8088,
        ui: { port: 8086 },
        startPath: '/'
    });

    gulp.watch(appSrc + '**/*.jade', ['jade']);
    gulp.watch(styleSrc + '**/*.scss', ['sass']);
    gulp.watch(scriptSrc + '**/*.js', ['js']);
    gulp.watch(imgSrc + '*', ['img']);
});

gulp.task('default', ['jade', 'sass', 'js', 'img', 'server']);
gulp.task('build', ['min:css', 'min:js']);