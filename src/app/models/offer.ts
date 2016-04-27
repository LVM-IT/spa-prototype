import {Customer} from './customer';

export class Offer {
    public angebotId: number;
    public partnerId: number;
    public angebotURI: string;
    public sparte: string;
    public rolle: string;
    public agentur: string;
    public persisted: boolean;
    public schaeden: number;
    public zahlungsweise: string;

    public get ablauf(): string {
        if (!this.versSchutz) {
            this.versSchutz = new Versicherungsschutz();
        }
        var beginn = this.versSchutz.versBeginn.split('.');
        var abl = new Date(parseInt(beginn[2], 10) + 1, parseInt(beginn[1], 10) - 1, parseInt(beginn[0], 10));
        return ("0" + abl.getDate()).slice(-2) + "." + ("0" + (abl.getMonth() + 1)).slice(-2) + "." + abl.getFullYear();
    }

    public set ablauf(value: string) {
        return;
    }

    public beitragZent: number;
    public customer: Customer;
    public fahrzeugdaten: Fahrzeugdaten;
    public nutzung: Nutzung;
    public versSchutz: Versicherungsschutz;

    constructor(angebotsId: number, partnerId: number) {
        this.persisted = false;
        this.fahrzeugdaten = new Fahrzeugdaten();
        this.nutzung = new Nutzung();
        this.versSchutz = new Versicherungsschutz();
        this.schaeden = 0;
        this.sparte = 'Kraftfahrt';
        this.zahlungsweise = 'jährlich';
        this.angebotId = angebotsId;
        this.partnerId = partnerId;

    }

    public get versichertist() {
        if (!this.fahrzeugdaten) {
            this.fahrzeugdaten = new Fahrzeugdaten();
        }
        return this.fahrzeugdaten.kennzeichen;
    }

    public set versichertist(value) {
        if (!this.fahrzeugdaten) {
            this.fahrzeugdaten = new Fahrzeugdaten();
        }
        this.fahrzeugdaten.kennzeichen = value;
    }

}

export class Nutzung {
    public beliebigeFahrer: string;
    public nachtAbstellplatz: string;
    public fahrleistungKm: number;
    public kilometerstand: number;
    public abweichenderFahrzeughalter: boolean;
    public nutzung: string;
    public selbstGenEigentum: boolean;
    public wohneigentumart: string;

    constructor() {
        this.nutzung = 'privat';
        this.wohneigentumart = 'wohnung';
        this.beliebigeFahrer = 'unbekannt';
        this.nachtAbstellplatz = 'straßenrand';
        this.fahrleistungKm = 0;
        this.kilometerstand = 0;
    }
}

export class Fahrzeugdaten {
    public art: string;
    public hsn: string;
    public typschl: string;
    public kennzeichen: string;
    public erstzulassung: string;
    public fahrgestell: string;
    public fahrzeugstaerkePS: number;
    public kennzeichenart: string;
    public austauschmotor: boolean;
    public wechselkennzeichen: boolean;

    constructor() {
        this.art = 'pkw';
        this.hsn = '';
        this.typschl = '';
        this.kennzeichen = '';
        this.erstzulassung = '';
        this.fahrgestell = '';
        this.fahrzeugstaerkePS = 0;
    }

}

export class Versicherungsschutz {

    public haftpflichSFR: string;
    public volkaskoSFR: string;
    public tarifgruppe: string;
    public versBeginn: string;

    constructor() {
        var d = new Date();
        this.versBeginn = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
    }
}

