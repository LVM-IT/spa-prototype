#Zwischenspeichern in Wizards

Im Rahmen des PoC wurde der Assistent **Brief erstellen** implementiert. Hierbei handelt es sich allerdings um einen *einfachen* Assistent, der keinerlei Zwischenspeichern des aktuellen Standes unterstützt. Im Rahmen des Gesamtprojektes werden allerdings komplexere Assistenten erstellt werden bei denen auch die Möglichkeit des Zwischenspeicherns gegeben sein soll.

Der Mechanismus des Zwischenspeicherns kann auf unterschiedliche Arten realisiert werden. Der aktuelle Stand kann entweder auf dem Client oder auf dem Server gespeichert werden.

Die Entscheidung ob auf dem Client oder auf dem Server gespeichert wird muss durch die fachliche Anforderung beantwortet werden.

Aus technischer Sicht kann auf dem Client zwischen unterschiedlichen Speicherorten gewählt werden

 * Local Storage
 * Session Storage
 * IndexedDB

## Local Storage

Der Local Storage stellt einen einfachen Schlüssel-Wert Speicher zur Verfügung der pro Anwendungsdomain angesprochen werden kann. Hier kann der Anwendungsentwickler auch strukturierte Daten in Form einer JSON Repräsentation ablegen. Hier gespeicherte Daten sind über die Browser Session hinweg persistiert, können allerdings vom Benutzer eingesehen und auch gelöscht werden.

## Session Storage

Der Session Storage verhält sich analog zum Local Storage allerdings wird dieser Speicher automatisch vom Browser gelöscht, sobald der Prozess beendet wird (Benutzer schließt das Tab oder den Browser).

## IndexedDB

Die IndexedDB erlaubt es dem Anwendungsentwickler Daten in einer NoSQL Datenbank lokal abzulegen. Bei Bedarf kann der in Anspruch genommene Plattenplatz einer Anwendung nach Bestätigung des Anwenders vergrößert werden, so dass hier enorme Datenmengen abgelegt werden können.

Durch die Developer Tools kann auch dieser Speicher durch den Benutzer eingesehen und manipuliert werden.

## Lokales Daten speichern

Grundsätzlich sollte beim Speichern von wichtigen Daten auf dem Client immer eine Prüfziffer erstellt werden. Beim Laden der Daten aus dem gewünschten Speicher kann anhand der Prüfziffer ermittelt werden ob die Daten durch einen Dritten manipuliert wurden oder noch im Originalzustand sind.

Generell muss die Anwendung auch mit dem Fall umgehen können, dass gespeicherte Daten durch den Browser (Funktion: lokale Daten löschen) oder den Anwender entfernt wurden.

## entferntes Speichern (Serverseitig)

Das Serverseitige Speichern hätte in diesem Fall den größten Mehrwert. Die Daten können intern gehalten werden und sind somit nicht vom Anwender manipulierbar oder gar löschbar.

Darüber hinaus kann der Anwender den Assistenten an einem beliebigen Endgerät erneut aufrufen und exakt an der gleichen Stelle weitermachen, an der er zuvor den Assistenten verlassen hat.

Zur Implementierung eines solchen Features wird lediglich ein `Service` benötigt. Hierbei spielt das verwendete SPA Framework keine Rolle.

Bevor der Assistent dem Endanwender präsentiert wird, muss durch  einen ausgehenden `HTTP GET` Aufruf sichergestellt werden ob zwischengespeicherte Daten vorhanden sind. Sind keine Daten vorhanden, so kann der Anwender mit der Verwendung des Assistenten beginnen.

Sind jedoch zuvor gespeicherte Daten vorhanden wir der Anwender darüber informiert und sollte selbst entscheiden ob er die Daten vom Server verwenden möchte oder den Assistenten **normal** (ohne die zwischengespeicherten Daten) starten möchte. Möchte der Anwender die Daten verwenden, so wird er automatisch auf die zuletzt geöffnete Seite des Assistenten umgeleitet. Jedes SPA Framework stellt Möglichkeiten zur Datenbindung bereit, daher muss nach dem Laden der Daten keinerlei **neuer Code** geschrieben werden damit sämtliche Daten wieder in der Oberfläche für den Benutzer ersichtlich sind.

Eine Möglichkeit des Zwischenspeicherns wäre die implizite Speicherung, hierbei wird bei jedem Seitenwechsel im Assistent der aktuelle Zustand (Das `model`) durch eine `HTTP POST` Anfrage an den Server gesendet. Der Server ist ab diesem Zeitpunkt dafür verantwortlich die empfangenen Daten benutzerspezifisch abzulegen. Darüber hinaus wird die gleiche Logik nochmals ausgeführt wenn der Benutzer den Dialog im normalen Verlauf schließt, um sicherzustellen, dass sämtliche Daten auf dem Server vorhanden sind.

Zur Ablage der Daten auf dem Server muss eine Kombination aus `Id des Assistenten`, `Id des Kunden/Interessenten` und `Id des Benutzers` verwendet werden, damit ein Sachbearbeiter möglichst viele Kombinationen an Zwischenständen auf dem Server halten kann ohne zuvor eingegebene Daten zu überschreiben.

