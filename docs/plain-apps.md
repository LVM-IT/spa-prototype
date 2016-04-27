# Nicht kundenbasierte Apps am Beispiel des Briefkastens

Im Kontext der LAS Anwendung gibt es 'allgemeine' oder 'nicht kundenbasierte Apps', hierzu zählt unter anderem der Briefkasten, welcher für jeden Anwendungsbenutzer Nachrichten und Wiedervorlagen darstellt. Über entsprechende Schaltflächen ermöglicht der Briefkasten den Benutzer schnell in kundenspezifische Ansichten zu gelangen.

Aus technischer Sicht kann es sich hierbei entweder um separate Anwendungen oder um Anwendungen handeln die im Kontext der `LAS-Root` App implementiert sind.

Durch die Wiederverwendung des bereitgestellten CSS-Frameworks wird eine analoge Darstellung aller Anwendungen im `LAS` Universum garantiert.

## Separate Anwendungen

Separate Anwendungen werden innerhalb der `LAS-Root` Anwendung durch ein `iFrame` gehostet. Für den Anwender ist diese Lösung nicht sichtbar, es fühlt sich für ihn/sie an wie eine Anwendung.  Durch das `lvm-core` Framework können separate Anwendungen einfach mit der äußeren `LAS-Root` App bidirektional kommunizieren.

Durch die bidirektionale Kommunikation können separate Anwendungen auch Funktionalitäten der `LAS-Root` App verwenden und müssen diese nicht nochmals implementieren. Im Rahmen des PoC wurden von der Thinktecture AG exemplarisch

 * Modale Dialoge
 * Darstellung von Validierungsfehlern

implementiert.

## Integrierte Anwendungen

Integrierte Anwendungen können im eigentlichen `LAS-Root` Projekt (im Repository im Ordner `src` zu finden) implementiert werden. Hierbei können natürlich auch die Mehrwerte der `LAS-Root` Anwendung genutzt werden (wie modale Dialoge, Darstellung für Validierungsfehler), darüber hinaus kann auch die Kommunikations API von `lvm-core` verwendet werden, so dass eine eventuelle **Extraktion** der Anwendung zu einem späteren Zeitpunkt ohne großen Aufwand realisiert werden kann.

## Integration ins Routing

Jede App wird durch eine eigene Route innerhalb der `LAS-Root` App repräsentiert. Bei Bedarf können sowohl **interne** als auch **separate** Anwendungen komplexe oder multiple Routen einnehmen un somit dem Anwender die gewünschte UX zu bieten.

Jeder implementierte Ansicht muss grundsätzlich **Reload-Safe** sein. Bedeutet dass die Anwendung ihren aktuellen Zustand über die Informationen der URL wiederherstellen kann. Dies ist zwingend Notwendig um die nativen Browserfunktionalitäten zu unterstützen.
