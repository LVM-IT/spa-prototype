# Framework Unabhängigkeit

Im Rahmen des SPA PoC der Thinktecture AG wurde der sogenannte `lvm-core` als framework-unabhängige Basis entwickelt. Hierbei handelt es sich um eine native JavaScript Bibliothek welche grundlegende, anwendungsspezifische Funktionalität bereitstellt ohne dabei eine Abhängigkeit zu SPA Frameworks wie Angular2 oder React vorauszusetzen.

Der `lvm-core` kann via `SystemJS` geladen werden und stellt sowohl für die äußere `LAS-Root` Anwendung als auch für beliebige `Child-Apps` einfache aber dennoch mächtige API's zur Verfügung.

## Kommunikations API

Der `lvm-core` erlaubt es Anwendungen in den `LAS-Root` zu integrieren und die Kommunikation zwischen den Apps zu koordinieren. Vom technischen Aspekt her wird die Kommunikation mittels `HTML5 Post Messages` realisiert. `Post Messages` erlauben die sichere Kommunikation über die Grenze des Frames hinweg.

Die Realisierung wurde auf Grundlage von Frames implementiert weil Stand 03-2016 nicht alle benötigten Browser native Unterstützung für `WebComponents` (oder auch `ShadowDOM` genannt) bieten. [(Siehe Browser-Support von ShadowDOM)](http://caniuse.com/#feat=shadowdom).

Jede Anwendung wird in einem dedizierten `iFrame` ausgeführt, wodurch jedes Entwicklungsteam das SPA Framework seiner Wahl verwenden kann und dadurch in seiner freien Framework-Wahl nicht eingeschränkt ist. Dadurch kann auch gewährleistet werden, dass die Gesamtanwendung nicht an ein bestimmtes Framework oder eine Framework Version gekoppelt ist.

`HTML5 Post Messages` erlauben das senden von einfachen JSON Strukturen über die Grenze des `iFrames` hinweg. Funktionen oder Callbacks zu versenden oder entfernten Code auszuführen ist aus Sicherheitsaspekten im HTML5 Standard verboten. Der `lvm-core` stellt jedoch eine Szenario basierte API zur Verfügung die es erlaubt `Child-Apps` in beliebiger Tiefe zu schachteln und dennoch im gesamten `Anwendungs-Baum` gezielt kommunizieren zu können. So können wiederverwendbare Komponenten zum Beispiel einen **modalen Dialog** von der `LAS-Root` App anfordern um eine selbst bereitgestellte HTML Seite darin darzustellen. Das eventuelle Ergebnis des modalen Dialoges bekommt der Anwendungsentwickler der `Child-App` wiederum bequem und unmittelbar als Parameter einer `ES-2015 Promise` geliefert.

Durch die transparente und flexible Kommunikations-API erlaubt der `lvm-core` schnell und zukunftsorientiert komplexe HTML5 Anwendungen zu implementieren ohne dem Anwendungsentwickler hierbei eine komplexe API bereitzustellen.

## Definition der LAS-Root Anwendung

Die `LAS-Root` Anwendung stellt die Hauptanwendung des PoC dar. Hier wird neben grundlegenden Funktionen der Anwendung auch das visuelle CSS Framework initialisiert welches von den inneren `Child-Apps` ebenfalls aus Gründen der Homogenität wiederverwendet werden sollte.

Um die `LAS-Root` App als solche im `lvm-core` bekannt zu machen, sind nur wenige Zeilen JavaScript Code notwendig. (Annahme hier ist, dass das `lvm-core` geladen ist)

```javascript
var root = new Root();
```

Durch erstellen einer neuen Instanz der Klasse `Root` wird die aktuelle Anwendung als `LAS-Root` gekennzeichnet.

Exemplarisch wurden einige markante Szenarien bereits im Rahmen des PoC als typisierte Nachrichten (`HTML5 Post Messages`) implementiert und die Klasse `Root` stellt entsprechende Methoden und Einstiegspunkte bereit um innerhalb der `LAS-Root` Anwendung darauf zu reagieren.

## Eine LAS-Kind Anwendung erstellen

Gesondert implementierte Anwendungen müssen zur Integration in `LAS-Root` das `lvm-core` Framework laden.
`lvm-core` kann im späteren Entwicklungs-Workflow von einer Registry wie `sinopia` oder einem privaten `npmjs` geladen werden. Sollte kein Package Repository verwendet werden, so muss  das Build-Ergebnis von `lvm-core` in den entsprechenden Unterordner der Kind Anwendung kopiert werden. (Beispiele hierzu sind ebenfalls im Repository zu finden).

Bei der Implementierung im Rahmen des PoC wurde analog zu *Angular2* ein **SystemJS** Paket erstellt, so dass die gesondert erstellte Anwendung lediglich eine SystemJS Konfiguration bereitstellen muss.



```javascript
System.config({
      packages: {
        lvm: { format: 'register', defaultExtension: 'js' }
      }
    });
```

Jedes SPA Framework stellt unterschiedliche Lifecycle Events bereit, in denen externe Bibliotheken (wie in diesem Fall `lvm-core` geladen werden sollten).

Im Repository sind Beispiele für **AngularJS** und **React** zu finden. Innerhalb einer AngularJS App kann `lvm-core` zum Beispiel in einen Angular Service gekapselt werden und dann bei Bedarf über den vorhandenen Dependency Injection Container angefordert werden.

```javascript
!function () {
    'use strict';

    /**
     * @ngdoc service
     * @public
     */
    function LasService($q) {
        var widget;
        var core;
        var initPromise;
        var lasRootApp = 'https://<<las-root-app-url>>';

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
```

Es ist zwingend notwendig die URL der `LAS-Root-App` anzugeben, denn nur wenn die Kind-Anwendung im Kontext von `LAS-Root` ausgeführt oder angesprochen wird, kann sichergestellt werden dass sämtliche Kommunikationen und Funktionen genutzt werden können.

Wird eine Kind-Anwendung ohne `LAS-Root` aufgerufen so generiert der `lvm-core` eine **Runtime-Exception** die den Entwickler darauf hinweist dass diese Anwendung nur im Kontext von `LAS-Root` betrieben werden kann.

## Exemplarische Kommunikation mit der LAS-Root App

Die `Widget` API stellt diverse Methoden zur Kommunikation mit dem Parent zur Verfügung. Die einzelnen Methoden und deren Parameter können dem Repository entnommen werden `src-core/api/`

So kann eine separat implementierte Kind-Anwendung mittels weniger Zeilen JavaScript einen modalen Dialog von `LAS-Root` anzeigen lassen und das vom Benutzer ausgewählte Ergebnis verarbeiten.

```html
<!-- AngularJS Anwendung -->
<h4>Ausgeübter Beruf {{ selectedJob }}</h4>

<button ng-click="showPopup()">Beruf jetzt auswählen</button>
```

Der Controller dieser AngularJS View verwendet den zuvor erstellten Service via Dependency Injection.

```javascript
!function () {
    'use strict';

    function OtherController($scope, $stateParams) {

        $scope.showPopup = function () {
            if (widget) {
                widget.openPopup('https://<<ng1appurl>>/', { title: 'LAS Berufsuche' })
                    .then(function (result) {
                        $scope.$apply(function () {

                            console.log('Got result!', result);
                            $scope.selectedJob = result;
                        })
                    });
            }
        };
    }
    app.module.controller('otherController', OtherController);
}();
```
