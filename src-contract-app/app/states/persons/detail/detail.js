!function () {
    'use strict';

    /**
     * @constructor
     * @public
     *
     * @param $scope
     * @param $stateParams
     * @param {SampleDataService} sampleDataService
     */
    function DetailController($scope, $stateParams, sampleDataService) {
        $scope.firstName = $stateParams.firstName;
        $scope.lastName = $stateParams.lastName;

        $scope.sampleData = sampleDataService.get();

        $scope.getSum = function () {
            return $scope.sampleData.reduce(function (total, current) {
                return total + current.beitrag;
            }, 0)
        };
    }

    app.module.controller('detailController', DetailController);
}();
