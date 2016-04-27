# Wichtige Kundenmerkmale

Wichtige Kundenmerkmale (oder Kopfdaten) müssen immer direkt im Zugriff sein. Der Sachbearbeiter muss in der Lage sein schnell benötigte Informationen zu finden um somit auf individuelle Ereignisse (zum Beispiel im Rahmen eines Telefonates) reagieren zu können.

Im Rahmen des PoC wurde hierzu eine `CustomerMetadataComponent` entwickelt, welche wichtige Informationen zum aktuellen Kunden darstellt und dem Sachbearbeiter darüber hinaus die Möglichkeit bietet diese Daten schnell zu bearbeiten.

Sollte der Anwender sich allerdings auf die Erfassung eines Angebotes, Auftrages oder sonstiger Daten konzentrieren, kann die Komponente durch einen einfache Klick minimiert werden. Im minimierten Zustand werden nur die wichtigsten Daten (zur Identifizierung des Kunden) angezeigt.

Die Komponente selbst kann beliebig in Anwendungsteile integriert werden. Zur korrekten Darstellung bedarf es lediglich einer Instanz des Types `Customer`, so dass alle Werte korrekt dargestellt werden können.

Die Komponente lädt die Daten bewusst nicht eigenständig um die Gesamtanzahl der `HTTP` Anfragen gegen das Backend zu minimieren.

Am Beispiel der Job-Auswahl wurde auch eine gesondert implementierte AngularJS App durch das `lvm-core` Framework integriert. Somit musste an dieser Stelle der Code zur Darstellung und Abbildung der Job-Auswahl nicht mehrfach implementiert werden.
