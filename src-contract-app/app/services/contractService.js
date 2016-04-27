!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     *
     * @param $http
     */
    function ContractService($http) {
        var baseUrl = 'http://lvm-rest-api.azurewebsites.net/';

        this.getById = function (contractId) {
            return $http.get(baseUrl + 'vertrag/' + contractId)
                .then(function (webResponse) {
                    return webResponse.data; 
                });
        };
    }

    app.module.service('contractService', ContractService);
}();
