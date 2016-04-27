!function () {
    'use strict';

    window.app = window.app || {};

    /**
     * @ngdoc overview
     * @name lvmJobSearchApp
     * @description
     * # lvmJobSearchApp
     *
     * Main module of the application.
     */
    app.module = angular
        .module('lvmSchufaApp', [
            'ui.router'
        ])
        .value('lasRootApp', 'http://lvm-develop-app1.azurewebsites.net/')
        .value('lasRootApp', 'http://localhost:8000/')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/check');

            $stateProvider
                .state('check', {
                    url: '/:customerId/check',
                    templateUrl: 'app/states/check/check.html',
                    controller: 'checkController'
                });
        })
        .run(function (lasService, $rootScope, $document, $interval) {
            var widget;
            var core;
            lasService.initialize()
                .then(function (w) {
                    widget = w;
                    return lasService.getCore();
                })
                .then(function (c) {
                    core = c;

                    var oldHeight;

                    $interval(function () {
                        var clientRect = $document[0].body.getBoundingClientRect();

                        if (clientRect.height == oldHeight) {
                            return;
                        }

                        oldHeight = clientRect.height;
                        var rectToSend = core.BoundingRect.fromClientRect(clientRect);
                        widget.boundingRectChanged(rectToSend);
                    }, 50);
                });
        });
}();
