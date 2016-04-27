!function () {
    'use strict';

    /**
     * @constructor
     * @public
     *
     */
    function NavController($rootScope, $stateParams) {
        var that = this;

        $rootScope.$on('$stateChangeSuccess', function () {
            that.contractId = $stateParams.contractId;
        });
    }

    app.module.controller('navController', NavController);
}();
