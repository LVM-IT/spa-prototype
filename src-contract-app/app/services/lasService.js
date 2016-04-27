!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     */
    function LasService($q, lasRootApp) {
        var widget;
        var core;
        var initPromise;

        this.initialize = function () {
            if (initPromise) {
                return initPromise;
            }

            return initPromise = System.import('lvm/core').then(function (lvm) {
                widget = new lvm.Widget(lasRootApp);
                widget.register();
                core = lvm;

                initPromise = undefined;

                return widget;
            });
        };

        this.getWidget = function () {
            if (widget) {
                return $q.when(widget);
            }

            if (!initPromise) {
                throw new Error('initialize was not called');
            }

            return initPromise;
        };

        this.getCore = function () {
            if (core) {
                return $q.when(core);
            }

            if (!initPromise) {
                throw new Error('initialize was not called');
            }

            return initPromise
                .then(function () {
                    return core;
                });
        }
    }

    app.module.service('lasService', LasService);
}();
