'use strict';

module.exports = (gulp, config, sync) => {
    gulp.task('watch', () => {
        gulp.watch(config.paths.stylesheets, sync.sync(['compile-stylesheets', 'reload']));
        gulp.watch(config.paths.scripts, sync.sync(['eslint']));
        gulp.watch(config.paths.html, sync.sync(['copy-static', 'reload', 'htmlhint']));
        gulp.watch(config.paths.static, sync.sync(['copy-static', 'reload']));
    });
};
