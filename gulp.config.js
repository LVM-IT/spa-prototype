'use strict';
const path = require('path');

var config = {
    coreBundleName: 'lvm/core',
    tsconfig: './tsconfig.json',
    sources: {
        injectables: [
            'dist/scripts/vendor.js',
            'dist/styles/bundle.css',
            'dist/styles/app.min.css'
        ],
        vendorStyles: 'vendor/styles/**/*',
        appStyles: './src/styles/**/*.css',
        wizardRootJSX: './src-wizard-app/app/root.jsx',
        rootFolder: 'src',
        coreSourceFolder: 'src-core',
        wizardRootFolder: 'src-wizard-app',
        samplePdf: './src/*.pdf'
    },
    targets: {
        coreRootFolder: 'dist-core',
        rootFolder: 'dist',
        vendorJs: 'vendor.js',
        wizardBundle: 'bundle.js'
    },
    globs: {}
};

config.sources.indexHtml = [
    path.join(config.sources.rootFolder, 'index.html'),
    path.join(config.sources.rootFolder, 'loading.html')
    ];
config.sources.appFolder = path.join(config.sources.rootFolder, 'app');
config.targets.wizardBundleFolder = path.join(config.sources.wizardRootFolder,'dist');
config.targets.appFolder = path.join(config.targets.rootFolder, 'app');
config.targets.scriptsFolder = path.join(config.targets.rootFolder, 'scripts');
config.targets.fontsFolder = path.join(config.targets.rootFolder, 'fonts');
config.targets.stylesFolder = path.join(config.targets.rootFolder, 'styles');
config.targets.imagesFolder = path.join(config.targets.rootFolder, 'images');

config.globs.allFromSource = [
    path.join(config.sources.rootFolder, '**/*'),
    path.join(config.sources.coreSourceFolder, '**/*')
];
config.globs.appTemplates = path.join(config.sources.appFolder, '**/*.html');
config.globs.allFromDist = path.join(config.targets.rootFolder, '**/*');
config.globs.allFromCoreDist = path.join(config.targets.coreRootFolder, '**/*');

config.globs.allCoreSourceFiles = path.join(config.sources.coreSourceFolder, "**/*.ts");
config.globs.vendorFonts = [
    'vendor/fonts/**/*',
    'node_modules/bootstrap/dist/fonts/**/*'
];
config.globs.allImages = path.join('images', '**/*');
config.globs.vendorScripts = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/es6-shim/s6-shim.js',
    'node_modules/systemjs/dist/system-polyfills.js',
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/rxjs/bundles/Rx.min.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/http.js',
    'node_modules/angular2/bundles/router.js',
    'vendor/bootstrap-datepicker.min.js',
    'vendor/bootstrap-datepicker.de.min.js'
];


config.coreSystemConfig = path.join(config.sources.coreSourceFolder, 'system.config.js');
config.coreTsconfig = path.join(config.sources.coreSourceFolder, 'tsconfig.json');
config.coreBundleFile = path.join(config.targets.coreRootFolder, 'lvm/bundles/lvm/core.js');
config.coreEs5DistFolder = path.join(config.targets.coreRootFolder, 'lvm/es5');
config.coreSymlinkTarget = path.join('node_modules', 'lvm');
config.coreContractTarget = path.join('src-contract-app', 'lvm');
config.coreJobSearchTarget = path.join('src-job-search-app', 'lvm');
config.coreWizardTarget = path.join('src-wizard-app', 'lvm');
config.coreSchufaTarget = path.join('src-schufa-app', 'lvm');
config.coreSymlinkSource = path.join(config.targets.coreRootFolder, 'lvm', '**','*');
module.exports = config;
