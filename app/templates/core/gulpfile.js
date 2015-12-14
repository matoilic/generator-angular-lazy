const gulp = require('gulp');
const g = require('gulp-load-plugins')();
const gulpSync = require('gulp-sync')(gulp);
const KarmaServer = require('karma').Server;
const path = require('path');
const Bundler = require('angular-lazy-bundler');

const paths = {
    build: {
        output: 'build'
    },
    sources: ['src/**/*.js'],
    configs: ['config/**/!(system).js', 'gulpfile.js'],
    stylesheets: ['src/**/*.scss'],
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

const serverPort = 8088;
const serverPortTest = 8089;

gulp.task('compile-source', function () {
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

gulp.task('compile-stylesheets', function () {
    return gulp
        .src(paths.stylesheets)
        .pipe(g.plumber())
        .pipe(g.sourcemaps.init())
        .pipe(g.sass({
            outputStyle: 'expanded',
            includePaths: [
                path.resolve('src')<% if(bootstrapCss) { %>,
                path.resolve('node_modules/bootstrap-sass/assets/stylesheets')<% } %>
            ]
        }))
        .pipe(g.autoprefixer())
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build.output));
});

gulp.task('copystatic', function () {
    return gulp
        .src(paths.static.concat(paths.html))
        .pipe(gulp.dest(paths.build.output));
});

gulp.task('build', [
    'copystatic',
    'compile-source',
    'compile-stylesheets'
]);

gulp.task('bundle', ['build'], function (done) {
    const bundler = new Bundler({
        systemJsConfig: 'config/system.js'
    });

    bundler
        .bundle({
            components: [
                'application',
                '<%= indexComponent %>'
            ],
            packages: [
                'angular',
                'angular-ui-router',
                'ui-router-extras',
                'oclazyload',<% if(i18n) { %>
                'angular-translate',<% } %>
                'css',
                'json',
                'text'
            ]
        }, 'main')
        .then(() => bundler.bundleRemainingComponents())
        .then(() => bundler.bundleRemainingPackages())
        .then(() => bundler.saveConfig())
        .then(() => done())
        .catch((err) => done(err));
});

gulp.task('test', ['build'], function (done) {
    new KarmaServer({
        configFile: __dirname + '/config/karma.js',
        singleRun: true
    }, function () {
        done();
    }).start();
});

gulp.task('webdriver-update', function (done) {
    const browsers = ['chrome'];

    if (process.platform === 'win32') {
        browsers.push('ie');
    }

    g.protractor.webdriver_update({ browsers: browsers }, done);
});

gulp.task('webdriver-standalone', g.protractor.webdriver_standalone);

gulp.task('test-e2e', ['build', 'webdriver-update'], function (done) {
    g.connect.server({
        port: serverPortTest,
        root: ['.']
    });

    gulp
        .src(path.join(paths.build.output + '/**/*-test.js'))
        .pipe(g.protractor.protractor({
            configFile: __dirname + '/config/protractor.js'
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
        .pipe(g.htmlhint.reporter());
});

gulp.task('eslint', function () {
    return gulp
        .src(paths.scripts.concat(paths.configs))
        .pipe(g.eslint())
        .pipe(g.eslint.format());
});

gulp.task('notify-recompiled', function () {
    return gulp
        .src(paths.scripts)
        .pipe(g.notify('recompiled changed files'));
});

gulp.task('watch', function () {
    gulp.watch(paths.stylesheets, gulpSync.sync(['compile-stylesheets', 'notify-recompiled']));
    gulp.watch(paths.scripts, gulpSync.sync(['compile-source', 'eslint', 'notify-recompiled']));
    gulp.watch(paths.html, gulpSync.sync(['copystatic', 'htmlhint', 'notify-recompiled']));
    gulp.watch(paths.static, gulpSync.sync(['copystatic', 'notify-recompiled']));
});

gulp.task('serve', ['build'], function () {
    g.connect.server({
        port: serverPort,
        root: ['.']
    });
});

gulp.task('default', ['build', 'watch', 'serve']);
