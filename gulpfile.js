var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var bs = require('browser-sync').create();
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var config = Object.create(webpackConfig);
var devCompiler = webpack(config);

var appSrc = 'src/app/',
    appDist = 'src/dist/app/',
    scriptSrc = 'src/script/',
    styleSrc = 'src/style/',
    scriptDist = 'src/dist/script/',
    styleDist = 'src/dist/style/',
    revDist = 'src/dist/rev/';

gulp.task('jade', function() {
    return gulp.src(appSrc + '**/*.jade')
        .pipe($.jade({ pretty: true }))
        .pipe(gulp.dest(appSrc))
        .pipe(bs.stream())
        // .pipe($.notify({ message: 'Jade task complete!' }));
});

gulp.task('sass', ['clean:css'], function() {
    return gulp.src(styleSrc + '**/*.scss')
        .pipe($.sass({ outputStyle: 'expanded' }))
        .pipe($.autoprefixer('>5%', 'ie 8'))
        .pipe($.cssSpriter({
            'spriteSheet':'src/dist/image/sprite.png',
            'pathToSpriteSheetFromCSS':'../image/sprite.png'
        }))
        // .pipe($.md5Plus(10, appSrc + '*.jade', { mappingFile: 'manifest.json' }))
        // .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(styleDist))
        .pipe(bs.stream())
        // .pipe($.notify({ message: 'Sass task complete!' }));
});

gulp.task('min:css', ['sass'], function() {
    return gulp.src(styleDist + '*.css')
        .pipe($.minifyCss())
        // .pipe($.rev())
        .pipe(gulp.dest(styleDist))
        // .pipe($.rev.manifest())
        // .pipe(gulp.dest(revDist))
});

gulp.task('build-js', ['clean:js'], function(callback) {
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
        // .pipe($.rev())
        .pipe(gulp.dest(scriptDist))
        // .pipe($.rev.manifest())
        // .pipe(gulp.dest(revDist))
});

gulp.task("clean:css", function() {
    return gulp.src(styleDist + '*')
        .pipe($.clean())
});

gulp.task("clean:js", function() {
    return gulp.src(scriptDist + '*')
        .pipe($.clean())
});

gulp.task('server', function() {
    bs.init({
        server: "./",
        // proxy: 'localhost',
        port: 8088,
        ui: { port: 8086 },
        startPath: 'src/app/index.html'
    });

    gulp.watch(appSrc + '**/*.jade', ['jade']);
    gulp.watch(styleSrc + '**/*.scss', ['sass']);
    gulp.watch(scriptSrc + '**/*.js', ['js']);
});

gulp.task('default', ['jade', 'sass', 'js', 'server']);
gulp.task('build', ['min:css', 'min:js']);


// gulp.task("revision", ['clean'], function() {
//     return gulp.src(js_path + 'dist/*.js')
//         .pipe($.rev())
//         .pipe(gulp.dest(js_path + 'dist2'))
//         .pipe($.rev.manifest())
//         .pipe(gulp.dest(js_path + 'dist2'))
// });

// gulp.task("revreplace", ["revision"], function() {
//     var manifest = gulp.src(js_path + "dist2/rev-manifest.json");

//     return gulp.src("src/app/index.html")
//         .pipe($.revReplace({ manifest: manifest }))
//         .pipe(gulp.dest('src/app'));
// });

// var spritesmith=require('gulp.spritesmith');

// gulp.task('sprite', function() {
//     return gulp.src('src/image/*.png')
//         .pipe(spritesmith({
//             imgName:'image/sprite.png',
//             cssName:'style/sprite.scss',
//             padding:20,
//             algorithm:'binary-tree',
//             cssTemplate:'src/style/handleSprite.scss'
//         }))
//         .pipe(gulp.dest('src/dist'))
// });
