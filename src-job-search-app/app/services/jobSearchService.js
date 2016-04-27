!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     *
     * @param $http
     */
    function JobSearchService($http) {
        var baseUrl = 'http://lvm-rest-api.azurewebsites.net/';

        this.search = function (searchText) {
            return $http.get(baseUrl + 'berufe', {
                    params: {
                        q: searchText
                    }
                })
                .then(function (webResponse) {
                    return webResponse.data;
                });
        };
    }

    app.module.service('jobSearchService', JobSearchService);
}();
