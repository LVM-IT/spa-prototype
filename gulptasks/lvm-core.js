(function () {
    'use strict';

    function RegisterTasks(gulp, config) {

        var typescript = require('gulp-typescript'),
            del = require('del'),
            Builder = require('systemjs-builder'),
            filelog = require('gulp-filelog'),
            merge = require('merge2'),
            runSequence = require('run-sequence'),
            sourceMaps = require('gulp-sourcemaps'),
            symlink = require('gulp-sym');

        var coreProject = typescript.createProject(config.coreTsconfig);

        gulp.task('[core]private:clean-bundle', function () {
            return del(config.globs.allFromCoreDist);
        });

        gulp.task('[core]private:transpile-bundle', function () {
            var tsResult = gulp.src(config.globs.allCoreSourceFiles)
                .pipe(sourceMaps.init())
                .pipe(typescript(coreProject));

            return merge([
                tsResult.dts.pipe(gulp.dest(config.targets.coreRootFolder)),
                tsResult.js
                    .pipe(sourceMaps.write('.'))
                    .pipe(gulp.dest(config.targets.coreRootFolder))
            ]);
        });

        gulp.task('[core]private:bundle', function () {
            var builder = new Builder();
            builder.loadConfig(config.coreSystemConfig)
                .then(function () {
                    builder.bundle(config.coreBundleName, config.coreBundleFile)
                })
        });

        gulp.task('build-core', function (done) {
            return runSequence('[core]private:clean-bundle', '[core]private:transpile-bundle', '[core]private:bundle', '[core]private:symlink-bundle', done)
        });

        gulp.task('[core]private:symlink-bundle', function () {
            del.sync(config.coreSymlinkTarget, { force: true });
            del.sync(config.coreContractTarget, { force: true });
            del.sync(config.coreJobSearchTarget, { force: true });
            del.sync(config.coreSchufaTarget, { force: true });

            return gulp.src(config.coreSymlinkSource)
                .pipe(gulp.dest(config.coreSymlinkTarget))
                .pipe(gulp.dest(config.coreContractTarget))
                .pipe(gulp.dest(config.coreJobSearchTarget))
                .pipe(gulp.dest(config.coreWizardTarget))
                .pipe(gulp.dest(config.coreSchufaTarget));

        });
    }

    module.exports = {
        init: RegisterTasks
    };
})();
