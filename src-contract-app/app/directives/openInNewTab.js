!function () {
    'use strict';

    app.module.directive('openInNewTab', function ($timeout, linkService) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var originalHref;
                    var cachedRootInstruction;

                    function cacheRootInstruction() {
                        // If the root instruction gets changed, the iFrame normally will be unloaded, so we can cache it here easily
                        linkService.getRootInstruction()
                            .then(function (location) {
                                cachedRootInstruction = location;
                            });
                    }

                    cacheRootInstruction();

                    function rewriteHref() {
                        element.attr('href', cachedRootInstruction + originalHref.substr(1));
                    }

                    function setOriginalHref() {
                        if (!originalHref) {
                            originalHref = element.attr('href');
                        }
                    }

                    function reset() {
                        element.attr('href', originalHref);
                    }

                    scope.$on('switchLinksToOpenInNewTab', function () {
                        setOriginalHref();
                        rewriteHref();
                    });

                    scope.$on('switchLinksToNormal', function () {
                        reset();
                    });

                    scope.$on('$stateChangeSuccess', function () {
                        originalHref = undefined;
                        cacheRootInstruction();
                    });

                    element[0].addEventListener('contextmenu', function () {
                        setOriginalHref();
                        rewriteHref();

                        $timeout(function () {
                            reset();
                        }, 5000);
                    });
                }
            };
        }
    )
    ;
}();
