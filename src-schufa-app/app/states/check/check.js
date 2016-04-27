!function () {
    'use strict';

    /**
     * @constructor
     * @public
     *
     * @param $scope
     * @param $stateParams
     * @param $timeout
     * @param {CustomerService} customerService
     * @param {LasService} lasService
     * @param lasRootApp
     */
    function CheckController($scope, $stateParams, $timeout, customerService, lasService, lasRootApp) {
        var customerId = $stateParams.customerId;

        $scope.model = {
            isChecking: false,
            checkDone: false,
            allowsSchufa: false,
            rating: -1
        };

        function initialize() {
            customerService.getById(customerId)
                .then(function (customer) {
                    $scope.customer = customer;
                });
        }

        $scope.check = function () {
            $scope.model.isChecking = true;
            $scope.model.checkDone = false;

            $timeout(function () {
                checkDone();
            }, 2000);
        };

        function checkDone() {
            $scope.model.isChecking = false;
            $scope.model.checkDone = true;

            $scope.model.rating = Math.floor(Math.random() * 6);
        }

        $scope.print = function () {
            lasService.getWidget()
                .then(function (widget) {
                    widget.openDocument(lasRootApp + 'Schufa-Sample.pdf');
                });
        };

        $scope.schufaChanged = function () {
            lasService.getWidget()
                .then(function (widget) {
                    widget.schufaChanged($scope.model.allowsSchufa);
                });
        };

        initialize();
    }

    app.module.controller('checkController', CheckController);
}();
