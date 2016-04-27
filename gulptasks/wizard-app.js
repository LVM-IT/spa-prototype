

(function(){
    'use strict';

    function RegisterTasks(gulp, config){
        var browserify = require('browserify'),
        babelify = require('babelify'),
        source = require('vinyl-source-stream');

        gulp.task('build-wizard', function () {
            browserify({
                entries: config.sources.wizardRootJSX,
                extensions: ['.jsx'],
                debug: false
            })
                .transform('babelify',  {presets: ['es2015', 'react']})
                .bundle()
                .on('error', function(err) { console.error(err); this.emit('end'); })
                .pipe(source(config.targets.wizardBundle))
                .pipe(gulp.dest(config.targets.wizardBundleFolder));
        });
    }

    module.exports = {
        init: RegisterTasks
    };
})();
