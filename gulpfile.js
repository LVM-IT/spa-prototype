var gulp = require('gulp'),
    del = require('del'),
    config = require('./gulp.config.js'),
    gulptasks = require('require-dir')('./gulptasks');

gulp.task('clean', function () {
    return del(config.globs.allFromDist, { force: true });
});

gulp.task('watch', function () {
    gulp.watch(config.globs.allFromSource, ['[web]private:rebuild']);
});

for(var task in gulptasks){
    gulptasks[task].init(gulp,config);
}
 