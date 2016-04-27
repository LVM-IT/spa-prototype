!function () {
    'use strict';

    window.app = window.app || {};

    /**
     * @ngdoc overview
     * @name lvmContractApp
     * @description
     * # lvmContractApp
     *
     * Main module of the application.
     */
    app.module = angular
        .module('lvmContractApp', [
            'ui.router'
        ])
        //.value('lasRootApp', 'http://lvm-develop-app1.azurewebsites.net/')
        .value('lasRootApp', 'http://localhost:8000/')
        .config(function ($stateProvider) {
            $stateProvider
                .state('contract', {
                    abstract: true,
                    url: '/:contractId',
                    template: '<ui-view/>'
                })
                .state('contract.overview', {
                    url: '/overview',
                    templateUrl: 'app/states/overview/overview.html',
                    controller: 'overviewController'
                })
                .state('contract.persons', {
                    url: '/verspers',
                    templateUrl: 'app/states/persons/persons.html',
                    controller: 'personsController'
                })
                .state('contract.persons.detail', {
                    url: '/:lastName/:firstName',
                    views: {
                        '@': {
                            templateUrl: 'app/states/persons/detail/detail.html',
                            controller: 'detailController'
                        }
                    }
                })
                .state('contract.persons.detail.deckung', {
                    url: '/:id',
                    views: {
                        '@': {
                            templateUrl: 'app/states/persons/detail/deckung/deckung.html',
                            controller: 'deckungController'
                        }
                    }
                })
                .state('contract.other', {
                    url: '/metadata',
                    templateUrl: 'app/states/other/other.html',
                    controller: 'otherController'
                });
        })
        .run(function ($location, lasService) {
            lasService.initialize()
                .then(function (widget) {
                    widget.routeChanged($location.$$path, true);
                });
        })
        .run(function ($rootScope, $location, $window, lasService) {
            $window.addEventListener('keyup', function (e) {
                console.log('handled on contract app');
                console.log(e);

                // CMD/CTRL
                if (e.keyCode === 91 || e.keyCode === 17) {
                    $rootScope.$broadcast('switchLinksToNormal');
                }

            });

            $window.addEventListener('keydown', function (e) {
                console.log('handled on contract app');
                console.log(e);

                // CMD/CTRL
                if (e.keyCode === 91 || e.keyCode === 17) {
                    $rootScope.$broadcast('switchLinksToOpenInNewTab');
                }

            });

            lasService.getWidget()
                .then(function (widget) {
                    $rootScope.$on("$stateChangeSuccess", function (e, toState, toParams, fromState, fromParams) {
                        widget.routeChanged($location.$$path, toParams.contractId !== fromParams.contractId);
                    });
                });
        });
}();
