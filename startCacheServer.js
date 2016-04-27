'use strict';

var express = require('express'),
    compression = require('compression'),
    ms = require('ms');

module.exports = function (port, directory, expressApp) {
    if (!expressApp) {
        expressApp = express();
    }

    expressApp.use(compression());
    expressApp.use(express.static(directory, { maxAge: ms('7 days')}));

    expressApp.listen(port, function () {
        console.log('Server on port', port, 'is up and running');
    });
};
