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
        .module('lvmJobSearchApp', [
            'ui.router'
        ])
        .value('lasRootApp', 'http://lvm-develop-app1.azurewebsites.net/')
        .value('lasRootApp', 'http://localhost:8000/')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/search');
            
            $stateProvider
                .state('search', {
                    url: '/search',
                    templateUrl: 'app/states/search/search.html',
                    controller: 'searchController'
                });
        })
        .run(function (lasService) {
           lasService.initialize();
        });
}();
