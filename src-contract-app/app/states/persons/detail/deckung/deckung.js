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
    function DeckungController($scope, $stateParams, sampleDataService) {
        var data = sampleDataService.get();

        $scope.firstName = $stateParams.firstName;
        $scope.lastName = $stateParams.lastName;

        $scope.sampleData = data.find(function (d) {
            return d.id == $stateParams.id
        });
    }

    app.module.controller('deckungController', DeckungController);
}();
