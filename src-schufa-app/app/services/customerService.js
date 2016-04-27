!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     *
     * @param $http
     */
    function CustomerService($http) {
        var baseUrl = 'http://lvm-rest-api.azurewebsites.net/';

        this.getById = function (customerId) {
            return $http.get(baseUrl + 'partner/' + customerId)
                .then(function (webResponse) {
                    return webResponse.data;
                });
        };
    }

    app.module.service('customerService', CustomerService);
}();
