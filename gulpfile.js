var gulp = require("gulp"),
    less = require("gulp-less"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    cssmin = require("gulp-cssmin"),
    plumer = require("gulp-plumber"),
    webpack = require("webpack"),
    webpackConfig = require("./config.js").webpack,
    browsersync = require("browser-sync").create(),
    browsersyncConfig = require("./config.js").browsersync,
    postcss = require('gulp-postcss'),
    rem = require('gulp-rem-plus'),
    path = require("path");

var lessSrc = './src/less/**/style.less',
    lessDict = 'src/less/**/*.less',
    imageSrc = 'src/img/**/*.*',
    media = 'src/media/**/*.*',
    jsSrc = 'src/js/**/*.*';

var distPath = './dist/';

//编译less
gulp.task('less', function () {
    return gulp.src(lessSrc)
        .pipe(plumer())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(rem({
            rem: 100,//rem单位:100
            dpr: 2
        }))
        .pipe(gulp.dest(distPath + 'css'));
});

//复制图片
gulp.task('images', function () {
    return gulp.src(imageSrc)
        .pipe(rename({dirname: '.'}))
        .pipe(gulp.dest(distPath + 'img/'));
});

//复制media
gulp.task('media', function () {
    return gulp.src(media)
        .pipe(rename({dirname: '.'}))
        .pipe(gulp.dest(distPath + 'media/'));
});

//webpack打包
gulp.task("webpack", function(callback) {

    var myConfig = Object.create(webpackConfig);

    myConfig.output.filename = distPath + 'js/main.js';

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            
        }));
        callback();
    });
});

//browsersync自动刷新
gulp.task("browsersync",function () {
    browsersync.init(browsersyncConfig);
})

//压缩less
gulp.task('lessmin', function () {
    return gulp.src(lessSrc)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(distPath + 'css'));
});

//压缩js
gulp.task("webpack:build", function(callback) {
    var myConfig = Object.create(webpackConfig);

    myConfig.plugins = myConfig.plugins.concat(
        new webpack.optimize.UglifyJsPlugin()
    );

    myConfig.output.filename = distPath + 'js/main.js';

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log("[webpack]", stats.toString({}));

        callback();
    });
});

//默认侦听
gulp.task('default', ['images', 'less', 'webpack', 'media'], function() {

    gulp.watch(imageSrc, ['images']);
    
    gulp.watch(lessDict, ['less']);
    
    gulp.watch(jsSrc, ['webpack']);

    gulp.watch(media, ['media']);

});

//自动刷新
gulp.task('sync', ['images', 'less', 'webpack', 'media','browsersync'], function() {

    gulp.watch(imageSrc, ['images']);
    
    gulp.watch(lessDict, ['less']);
    
    gulp.watch(jsSrc, ['webpack']);

    gulp.watch(media, ['media']);

});

//压缩
gulp.task('zip', ['images', 'lessmin', 'webpack:build', 'media']);


