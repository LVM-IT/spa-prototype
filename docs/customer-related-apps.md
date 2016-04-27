# Kundenbasierte Apps

Viele alltägliche Aufgaben der Sachbearbeiter sind im Umfeld des Kunden angesiedelt. Deshalb wird ein Konzept zur Abbildung von **kundenbasierten Apps** zwingend benötigt, so dass zukünftige Apps einen homogenen Aufbau haben und Funktionalitäten wiederverwenden können.


## Integration in LAS-ROOT

`LAS-Root` stellt einige Funktionalitäten bereit die von jeder App wiederverwendet werden können. Durch die Verwendung der `Widget` API des `lvm-core` Frameworks können diese Funktionalitäten über die Grenze der eigentlichen Anwendung hinweg angefordert werden.

Die `Widget` API ist hierbei Use Case basiert implementiert, so dass der Einstieg und die Verwendung der API für den Anwendungsentwickler sehr einfach sind.

Die nachfolgenden Codezeilen sind dem PoC der Thinktecture AG entnommen und zeigen wie einfach ein modaler Dialog angefragt und das Ergebnis der Benutzerauswahl verarbeitet werden kann.

```javascript
$scope.showPopup = function () {
  if (widget) {
    widget.openPopup('http://localhost:9898/', { title: 'LAS Berufsuche' })
    .then(function (result) {
       $scope.$apply(function () {
         $scope.selectedJob = result;
       });
     });
  }
};
```

Hierbei ist der Aufruf in einer AngularJS Anwendung (konkret die Vertragsanwendung zu finden im Repository unter `src-contract-app`).

## Den Kunden-Kontext wahren

Sobald die Anwendung im Kontext eines Kunden ist, steht die `PartnerId` des Kunden zur Verfügung und kann für den Aufruf von internen oder externen kundenbasierten Apps verwendet werden.

Bei internen Apps handelt es sich um einfache Angular2 Komponenten, die entweder via `@Input` Property die `PartnerId` oder gar die komplette Instanz des aktuell geladenen `Customers` in Empfang nehmen. Sofern die Komponente selbstständig betrieben werden kann und die Ansicht direkt zugreifbar sein muss, besteht auch die Möglichkeit eine dedizierte `Route` für die Ansicht zu generieren. Hierzu muss die `PartnerId` dann als dynamischer Teil der Route konfiguriert werden.

Die Vertragsübersicht des Kunden könnte daher über die folgende Route abgebildet werden `/customer/:partnerId/contracts`. Innerhalb der dazugehörigen `CustomerContractsComponent` wird unter Verwendung des existierenden `CustomerService` der Kunde anhand der `partnerId` geladen.

Externe Apps werden mittels `iFrame` in `LAS-Root` integriert. Hierbei kann entweder die `PartnerId` an die URL der externen Anwendung übergeben werden, oder die externe Anwendung kann unter Verwendung des `lvm-core` Frameworks die aktuelle Id des Kunden bei `LAS-Root` anfragen.

Dadurch ist für beide Szenarien eine einfache Integration von kundenbasierten Anwendungen in die Gesamtanwendung vorhanden.
