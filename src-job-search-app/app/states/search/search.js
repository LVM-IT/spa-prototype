!function () {
    'use strict';

    /**
     * @constructor
     * @public
     *
     * @param $scope
     * @param {UrlParameterService} urlParameterService
     * @param {JobSearchService} jobSearchService
     * @param {LasService} lasService
     */
    function SearchController($scope, urlParameterService, jobSearchService, lasService) {
        var openerWidgetId = urlParameterService.getValue('openerWidgetId');
        var messageId = urlParameterService.getValue('messageId');

        function search(searchText) {
            return jobSearchService.search(searchText)
                .then(function (results) {
                    $scope.searchResults = results;
                });
        }

        $scope.search = function () {
            search($scope.searchText)
                .then(function () {
                    $scope.searchedText = $scope.searchText;
                });
        };

        $scope.select = function (jobModel) {
            var dto = {
                id: jobModel.berufId,
                name: jobModel.name
            };
            
            console.log('Sending', dto, 'back to widget', openerWidgetId, 'with message id', messageId);

            lasService.getWidget()
                .then(function (widget) {
                    widget.sendPopupResponse(openerWidgetId, messageId, dto);
                    widget.closePopup();
                });
        };
    }

    app.module.controller('searchController', SearchController);
}();
