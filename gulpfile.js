const config = require('./config/gulp');
const glob = require('glob');
const gulp = require('gulp');
const sync = require('gulp-sync')(gulp);

glob.sync('./gulp-tasks/*.js').forEach((file) => {
    require(file)(gulp, config, sync);
});
