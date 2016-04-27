!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     */
    function SampleDataService() {
        var sampleData = [
            generateSampleData(1, 'Invalidität', 'ProgressionPlus', 'Vollinvalidität'),
            generateSampleData(2, 'Rente', 'erhöhte Rente', 'ab 90 % Invalidität: 1.000.000'),
            generateSampleData(3, 'Sofortleistung'),
            generateSampleData(4, 'Todesfall'),
            generateSampleData(5, 'Kosmetische Operationen'),
            generateSampleData(6, 'Krankenhaustagegeld', '', 'ab 4. Tag 40,00 / bei ambulanter OP: 60,00'),
            generateSampleData(7, 'Rettungs- und Bergungskosten'),
            generateSampleData(8, 'Reha-Beihilfe')
        ];

        this.get = function () {
            return sampleData;
        };

        function generateSampleData(id, deckungsart, modell, beschreibung) {
            return {
                id: id,
                deckungsart: deckungsart,
                summe: Math.floor(Math.random() * 100000 + 10000),
                berechnungsmodell: modell,
                beschreibung: beschreibung,
                beitrag: Math.random() * 100
            };
        }
    }

    app.module.service('sampleDataService', SampleDataService);
}();
