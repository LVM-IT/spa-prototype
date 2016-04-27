!function () {
    'use strict';

    /**
     * @ngdoc filter
     * @name yesNo
     * @public
     */
    function YesNoFilter() {
        return function (value) {
            return !!value ? 'ja' : 'nein';
        };
    }

    app.module.filter('yesNo', YesNoFilter);
}();
