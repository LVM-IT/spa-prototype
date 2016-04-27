!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     */
    function UrlParameterService() {
        var location = window.location;

        function getQueryVariable(variable) {
            var query = location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
        }

        this.getValue = function (name) {
            return getQueryVariable(name);
        };
    }

    app.module.service('urlParameterService', UrlParameterService);
}();
