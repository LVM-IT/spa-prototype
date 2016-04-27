!function () {
    'use strict';

    /**
     * @constructor
     * @public
     *
     * @param $scope
     */
    function OtherController($scope, $stateParams) {

        $scope.showPopup = function () {
            if (widget) {
                widget.openPopup('http://localhost:9898/', { title: 'LAS Berufsuche' })
                    .then(function (result) {
                        $scope.$apply(function () {

                            console.log('Got result!', result);
                            $scope.selectedJob = result;
                        })
                    });
            }
        };
 
    }

    app.module.controller('otherController', OtherController);
}();
