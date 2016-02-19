const gulp = require('gulp');
const mocha = require('gulp-mocha');
const fs = require('fs-extra');
const path = require('path');
const runSequence = require('run-sequence');
var child_process = require('child_process');
/**
 * This test tasks process was based and inspired in the one used in:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 */


gulp.task('installnpm', function (done) {
    child_process.exec('npm install --quiet', { cwd: './test/fixtures' }, function (error, stdout, stderr) {
        //we dont want to eval the result as it will be done in test spec
        //so we are just returning good
        done();
    });
})
gulp.task('installjspm', function (done) {
    child_process.exec('jspm install --yes', { cwd: './test/fixtures' }, function (error, stdout, stderr) {
        //we dont want to eval the result as it will be done in test spec
        //so we are just returning good
        done();
    });
})
gulp.task('copyManifests', function (done) {
    const genVer = require('./package.json').version;
    const dest = __dirname + '/test/fixtures/';
    fs.ensureDir(dest, (err) => {
        if (err) {
            done(err);
        }
        // read file, strip all ejs conditionals, and parse as json
        const json = JSON
            .parse(fs.readFileSync(path.resolve('app/templates/core/_package.json'), 'utf8')
                .replace(/<%(.*)%>/g, ''));
        json.name = 'testApp';
        json.version = genVer;
        // stringify json and write it to the destination
        fs.writeFile(path.resolve(dest + 'package.json'), JSON.stringify(json, null, 2), (err) => {
            done(err ? err : undefined);
        });
    });
});
gulp.task('testPrepare', function (done) {
    return runSequence(
        'copyManifests',
        'installnpm',
        'installjspm',
        done
    );
});
gulp.task('test', ['testPrepare'], function () {
    return gulp.src('test/*_spec.js', { read: false })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'spec'/*'nyan'*/ }))
        .once('error', function (err) {
            console.log(err);
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
