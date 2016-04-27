!function () {
    'use strict';

    /**
     * @constructor
     * @public
     *
     * @param $scope
     * @param $stateParams
     * @param $sce
     * @param {ContractService} contractService
     * @param {LasService} lasService
     */
    function OverviewController($scope, $stateParams, $sce, contractService, lasService) {
        $scope.iFrameHeight = 100;

        function initialize() {
            contractService.getById($stateParams.contractId)
                .then(function (contract) {
                    $scope.contract = contract;

                    $scope.iFrameSource = $sce.trustAsResourceUrl('http://localhost:9888/#/' + contract.partnerId + '/check');

                    return lasService.getWidget();
                })
                .then(function (widget) {
                    widget.onBoundingRectChanged = function (boundingRect) {
                        $scope.$apply(function () {
                            $scope.iFrameHeight = boundingRect.height;
                        });
                    };

                    widget.onSchufaChanged = function (clientAccepted) {
                        $scope.$apply(function () {
                            $scope.clientAcceptedSchufa = clientAccepted;
                        });
                    };
                });
        }

        $scope.$on('$destroy', function () {
            lasService.getWidget()
                .then(function (widget) {
                    widget.onBoundingRectChanged = undefined;
                    widget.onSchufaChanged = undefined;
                })
        });

        initialize();
    }

    app.module.controller('overviewController', OverviewController);
}();
