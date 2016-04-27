# Project Journal

Use this journal to describe your daily doings.

## 08.03.2016

### Manuel

* Baumdarstellung
    * Die Übersicht zu einem Kunden per Baumdarstellung wurde implementiert.
* Erweiterung der Routing-Basis-Implementierung
    * Die Möglichkeit eines Subroutings wurde beispielhaft implementiert.
* Upgrade auf Angular 2 Beta 8
* Gulp Watch bezieht CSS-Datei mit ein

## 07.03.2016

### Manuel

* Routing-Basis-Implementierung
    * Geänderte States im Child werden an Root weiter gereicht, sodass dieser die URL im Browser umschreiben kann.
    * Beim Reload wird versucht die Anwendung korrekt zu laden, d.h. dass die Root-App auf die Seite der URL navigiert und ggf. weitere Daten in die URL des Kindes packt.

## 04.03.2016
 * Funktionierende Version der Kommunikations API erstellen für LAS App

## 03.03.2016

### Thorsten

 * Anpassungen für das Deployment in Azure, Betrieb jeder App.
 * Weiterentwicklung Kommunikations API

## 26.02.2016

### Thorsten

Anpassung der Kommunikations-API. Es wird dedizierte APIs für die äußere App `LVM-POC-ROOT` und die Kind-Apps geben.

Wenn ein App Entwickler eine neue App in `LVM-POC-ROOT` integrieren möchte, darf keine Konfiguration in der Haupt App notwendig sein. Lediglich die Integration der Direktive. 

Kommunikationswege:

```
LVM-POC-ROOT <-> LVM-CONTRACT_APP <-> LVM-JOB-SEARCH
LVM-POC-ROOT <----------------------> LVM-JOB-SEARCH
```
 
 Mögliche Kommunikationen:
 
 `LVM-JOB-SEARCH` fordert ein popup bei `LVM-POC-ROOT` an. Wenn der User eine Auswahl trifft wird die Selektion an `LVM-JOB-SEARCH` gegeben.
 
 `LVM-CONTRACT-APP` fragt aktuelle Daten zum Speichern / Validieren bei `LVM-JOB-SEARCH` an. 
 
 `LVM-CONTRACT-APP` möchte die Validation-Message anzeigen und fragt dies bei `LVM-POC-ROOT` an. 

## 25.02.2016

### Thorsten
   
    * Abstimmung der Architektur
    * Implementierung von Placeholder Komponenten für Search und Customer List 
