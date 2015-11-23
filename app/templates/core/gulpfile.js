var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var gulpSync = require('gulp-sync')(gulp);
var KarmaServer = require('karma').Server;
var path = require('path');
var Bundler = require('angular-lazy-bundler');

var paths = {
    build: {
        output: 'build'
    },
    sources: 'src/**/*.js',
    stylesheets: 'src/**/*.scss',
    scripts: [
        'src/**/*.js',
        'gulpfile.js'
    ],
    html: [
        'src/**/*.html',
        'index.html'
    ],
    static: [
        './src/**/*.json',
        './src/**/*.svg',
        './src/**/*.woff',
        './src/**/*.woff2',
        './src/**/*.ttf',
        './src/**/*.png',
        './src/**/*.gif',
        './src/**/*.ico',
        './src/**/*.jpg',
        './src/**/*.eot'
    ]
};

var serverPort = 8088;
var serverPortTest = 8089;

gulp.task('compile-source', function() {
    return gulp
        .src(paths.sources)
        .pipe(g.plumber())
        .pipe(g.sourcemaps.init())
        .pipe(g.babel({
            presets: [
                'es2015',
                'stage-2'
            ]
        }))
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build.output));
});

gulp.task('compile-stylesheets', function() {
    return gulp
        .src(paths.stylesheets)
        .pipe(g.plumber())
        .pipe(g.sourcemaps.init())
        .pipe(g.sass({
            outputStyle: 'expanded',
            includePaths: [
                path.resolve('src')
            ]
        }))
        .pipe(g.autoprefixer())
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build.output));
});

gulp.task('copystatic', function() {
    return gulp
        .src(paths.static.concat(paths.html))
        .pipe(gulp.dest(paths.build.output));
});

gulp.task('build', [
    'copystatic',
    'compile-source',
    'compile-stylesheets'
]);

gulp.task('bundle', ['build'], function(done) {
    var bundler = new Bundler({
        systemJsConfig: 'config/system.js'
    });

    bundler
        .bundleComponents()
        .then(function()  {
            // these are the main dependencies required at application startup
            return bundler.bundleDependencies(
                [
                    'angular',
                    'angular-ui-router',
                    'ui-router-extras',
                    'oclazyload',<% if(i18n) { %>
                    'angular-translate',<% } %>
                    'css',
                    'json',
                    'text'
                ],
                'main-vendors'
            );
        })
        .then(function() {
            return bundler.bundlePackageDependencies()
        })
        .then(function() {
            return bundler.saveConfig();
        })
        .then(function() {
            done();
        })
        .catch(done)
});

gulp.task('test', ['build'], function(done) {
    new KarmaServer({
        configFile: __dirname + '/config/karma.js',
        singleRun: true
    }, function() {
        done();
    }).start();
});

gulp.task('webdriver-update', function(done) {
    var browsers = ['chrome'];

    if(process.platform === 'win32') {
        browsers.push('ie');
    }

    g.protractor.webdriver_update({browsers: browsers}, done);
});

gulp.task('webdriver-standalone', g.protractor.webdriver_standalone);

gulp.task('test-e2e', ['build', 'webdriver-update'], function(done) {
    var params = process.argv;
    var args = params.length > 3 ? [params[3], params[4]] : [];

    g.connect.server({
        port: serverPortTest,
        root: ['.']
    });

    args.push(
        '--baseUrl',
        'http://localhost:' + serverPortTest
    );

    gulp
        .src(path.join(paths.build.output + '/**/*-test.js'))
        .pipe(g.protractor.protractor({
            configFile: __dirname + '/config/protractor.js',
            args: args
        }))
        .on('error', function (err) {
            g.connect.serverClose();

            throw err;
        })
        .on('end', function () {
            g.connect.serverClose();

            done();
        });
});

gulp.task('htmlhint', function () {
    return gulp
        .src(paths.html)
        .pipe(g.htmlhint('.htmlhintrc'))
        .pipe(g.htmlhint.reporter())
        .pipe(g.htmlhint.failReporter());
});

gulp.task('jshint', function () {
    return gulp
        .src(paths.scripts)
        .pipe(g.jshint('.jshintrc'))
        .pipe(g.jshint.reporter('jshint-stylish'))
        .pipe(g.jshint.reporter('fail'));
});

gulp.task('notify-recompiled', function() {
    return gulp
        .src(paths.scripts)
        .pipe(g.notify('recompiled changed files'));
});

gulp.task('watch', function() {
    gulp.watch(paths.stylesheets, gulpSync.sync(['compile-stylesheets', 'notify-recompiled']));
    gulp.watch(paths.scripts, gulpSync.sync(['compile-source', 'jshint', 'notify-recompiled']));
    gulp.watch(paths.html, gulpSync.sync(['copystatic', 'htmlhint', 'notify-recompiled']));
    gulp.watch(paths.static, gulpSync.sync(['copystatic', 'notify-recompiled']));
});

gulp.task('serve', ['build'], function(){
    g.connect.server({
        port: serverPort,
        root: ['.']
    });
});

gulp.task('default', ['build', 'watch', 'serve']);
