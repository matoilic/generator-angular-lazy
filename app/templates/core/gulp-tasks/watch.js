/*eslint-disable */
'use strict';
/*eslint-enable */

module.exports = (gulp, config, sync) => {
    gulp.task('watch', () => {
        gulp.watch(config.paths.stylesheets, sync.sync(['compile-stylesheets', 'notify-recompiled']));
        gulp.watch(config.paths.scripts, sync.sync(['compile-source', 'eslint', 'notify-recompiled']));
        gulp.watch(config.paths.html, sync.sync(['copy-static', 'htmlhint', 'notify-recompiled']));
        gulp.watch(config.paths.static, sync.sync(['copy-static', 'notify-recompiled']));
    });
};
