!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     *
     * @param $q
     * @param $timeout
     * @param {LasService} lasService
     */
    function LinkService($q, $timeout, lasService) {
        var requestPromise;

        this.getRootInstruction = function () {
            if (requestPromise) {
                return requestPromise;
            }

            var deferred = $q.defer();
            requestPromise = deferred.promise;

            // For batching the requests
            $timeout(function () {
                console.log('entering timeout');
                lasService.getWidget()
                    .then(function (widget) {
                        widget.getRootInstruction()
                            .then(function (widgetResponse) {
                                requestPromise = undefined;
                                deferred.resolve(widgetResponse.data);
                            }, function (err) {
                                requestPromise = undefined;
                                deferred.reject(err);
                            });        
                    });
            }, 50);

            return requestPromise;
        };
    }

    app.module.service('linkService', LinkService);
}();
