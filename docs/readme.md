# LVM PoC Dokumentation

Dokumentation des LVM Proof of Concept der Thinktecture AG. Die gewünschten UseCases wurde unter Verwendung unterschiedlicher Single Page Application (SPA) Frameworks realisiert. Zum Einsatz kamen hierbei

 * Google Angular 2 [Webseite](https://angular.io/)
 * Google AngularJS 1 [Webseite](https://angularjs.org/)
 * Facebook React [Webseite](https://facebook.github.io/react/)

Die Gesamtanwendung wird auf 5 getrennten WebServern (ebenfalls fünf unterschiedliche Domains) betrieben um die Integration über die Domaingrenze hinweg zu demonstrieren. Der Kern der Anwendung wurde framework-unabhängig implementiert und ist [hier gesondert beschrieben](framework-independency.md).

## Feature Dokumentation

* [integriertes Hilfesystem](hilfesystem.md)
* [Kunde schaut mit auf Anwendung](privacy.md)
* [Freischalten gesperrter Felder](field-audit.md)
* [Zwischenspeichern in Wizards](complex-wizards.md)
* [Vorgänge](dossiers.md)
* [Kundenbasierte Apps](customer-related-apps.md)
* [Nicht kundenbasierte Apps am Beispiel des Briefkastens](plain-apps.md)
* [Schnelleinstieg in zentrale Anwendungsbereiche](app-quick-access.md)
* [Wichtige Kundenmerkmale](customer-metadata.md)
* [Vertragsanbindung](contract-component.md)

## Client Architektur

* UserExperience
* Integrationsfähigkeit
* Native Browserfunktionalität
* Entwicklerproduktivität
* Langlebigkeit
* Testbarkeit
* Modularisierung
* Anpassbarkeit
* [Mobilfähigkeit](mobilfaehigkeit.md)

### To Be Documented


* Nutzbar für Onlinegeschäft

