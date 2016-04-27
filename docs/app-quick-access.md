# Schnelleinstieg in zentrale Apps

Wichtige Bestandteile der Gesamtanwendung müssen für den Anwender schnell zugreifbar sein um den täglichen Arbeitsablauf zu optimieren.

Hierzu werden in der SPA unterschiedliche Routen definiert die aus jedem beliebigen Programmbereich angesprochen werden können. Somit kann (ähnlich wie in der aktuellen Anwendung) ein App Menu realisiert werden welches sowohl Apps im Kundenkontext als auch allgemeine Apps für den Benutzer schnell zugreifbar macht.

Sobald sich der Sachbearbeiter im Kontext eines Kunden befinden ist dessen `PartnerId` innerhalb der Anwendung verfügbar und kann an die jeweiligen Routen angehangen werden. Durch das Verwenden von Routen im Schema `/apps/customer-related-app/:partnerId` kann die `PartnerId` dann an jeden Anwendungsbestandteil weitergegeben werden.

Sollte die Anwendung als gesonderte App realisiert worden sein, so kann die `PartnerId` natürlich auch an die gesonderte App weitergegeben werden. Durch die Integration des `lvm-core` können bei Bedarf auch weitere kontextabhängige Informationen bei der `LAS-Root` App angefragt werden.
