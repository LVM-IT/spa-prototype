(function () {
    'use strict';

    function RegisterTasks(gulp, config) {

        var del = require('del'),
            inject = require('gulp-inject'),
            concat = require('gulp-concat'),
            typescript = require('gulp-typescript'),
            htmlmin = require('gulp-htmlmin'),
            cssmin = require('gulp-cssmin'),
            rename = require('gulp-rename'),
            sourceMaps = require('gulp-sourcemaps'),
            runSequence = require('run-sequence');


        gulp.task('[web]private:build-vendor-scripts', function () {
            return gulp.src(config.globs.vendorScripts)
                .pipe(concat(config.targets.vendorJs))
                .pipe(gulp.dest(config.targets.scriptsFolder))
        });

        gulp.task('[web]private:copy-core-bundle', function () {
            return gulp.src('./dist-core/lvm/**/*')
                .pipe(gulp.dest('./dist/lvm/'));
        });

        gulp.task('[web]private:build-index', function () {
            var injectables = gulp.src(config.sources.injectables);

            return gulp.src(config.sources.indexHtml)
                .pipe(inject(injectables, {
                    addRootSlash: false,
                    ignorePath: 'dist'
                }))
                .pipe(htmlmin({ collapseWhitespace: true }))
                .pipe(gulp.dest(config.targets.rootFolder));
        });

        gulp.task('[web]private:build-app', function () {
            var project = typescript.createProject(config.tsconfig,
                { typescript: require('typescript') });

            var tsResult = project.src()
                .pipe(sourceMaps.init())
                .pipe(typescript(project));
            tsResult.js
                .pipe(sourceMaps.write('.'))
                .pipe(gulp.dest(config.targets.appFolder));
        });

        gulp.task('[web]private:copy-vendor-fonts', function () {
            return gulp.src(config.globs.vendorFonts)
                .pipe(gulp.dest(config.targets.fontsFolder));
        });

        gulp.task('[web]private:copy-images', function () {
            return gulp.src(config.globs.allImages)
                .pipe(gulp.dest(config.targets.imagesFolder));
        });

        gulp.task('[web]private:build-vendor-styles', function () {
            return gulp.src(config.sources.vendorStyles)
                .pipe(cssmin())
                .pipe(concat('bundle.css'))
                .pipe(gulp.dest(config.targets.stylesFolder));
        });

      
        gulp.task('[web]private:build-app-styles', function () {
            return gulp.src(config.sources.appStyles)
                .pipe(cssmin())
                .pipe(rename('app.min.css'))
                .pipe(gulp.dest(config.targets.stylesFolder))
        });

        gulp.task('[web]private:copy-app-templates', function () {
            return gulp.src(config.globs.appTemplates)
                .pipe(gulp.dest(config.targets.appFolder));
        });

        gulp.task('[web]private:copy-lvm-sample-pdf', function(){
           return gulp.src(config.sources.samplePdf)
               .pipe(gulp.dest(config.targets.rootFolder))
        });

        gulp.task('build-web', function (done) {
            return runSequence('clean', 'build-core',
                [
                    'build-wizard',
                    '[web]private:build-vendor-scripts',
                    '[web]private:build-vendor-styles',
                    '[web]private:build-app-styles',
                    '[web]private:copy-vendor-fonts',
                    '[web]private:copy-lvm-sample-pdf',
                    '[web]private:copy-images',
                    '[web]private:build-app',
                    '[web]private:copy-app-templates',
                    '[web]private:copy-core-bundle'],
                '[web]private:build-index',
                done);
        });

        gulp.task('[web]private:rebuild', function (done) {
            return runSequence('build-core',
                [
                    'build-wizard',
                    '[web]private:build-app',
                    '[web]private:copy-app-templates',
                    '[web]private:build-app-styles',
                    '[web]private:copy-core-bundle'],
                done);
        });

    }

    module.exports = {
        init: RegisterTasks
    };
})();
