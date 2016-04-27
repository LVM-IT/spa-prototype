import {Customer} from './customer';
import {Address} from './address';

export class Damage {

    public dayOfDamage: string;
    public contractId: number;
    public vsnr: string;
    public status: string;
    public bearbeiter: string;
    public bearbeiterId: number;
    public vertrauensmann: string;
    public vertrauensmannId: number;
    public customer: Customer;
    public kennzeichen: string;
    public risiko: string;
    public mahnaktion: string;
    public leistungsfrei: string;
    public selbstbeteiligung: number;
    public verischerungsSumme: number;
    public versicherungsBegingung: string;
    public reserve: number;
    public deckungVersicherungsNehmer: string;
    public art: string;
    public hoehe: number;
    public forderung: number;
    public deckungMitversichertePerson: number;
    public weitereSchaeden: number;
    public kurzbeschreibungSchadensereignis: string;
    public schadensHergang: string;
    public meldungDurch: string;
    public schadensOrt: string;
    public verschuldungsAngabe: string;

    constructor() {
        var d = new Date();
        this.dayOfDamage = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
        this.status = "vorläufigerSchaden";
        this.art = "verkehrsunfall";
        this.deckungVersicherungsNehmer = "ungeprüft";

    }

}

export class DamageDefaults {
    public vsnr: string;
    public anschrift: Address;
}
