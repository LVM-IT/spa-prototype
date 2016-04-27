import {Address} from './address';

export class Customer {
    public partnerId: number;
    public partnerURI: string;
    public anrede: string;
    public name: string;
    public vorname: string;
    public geburtsdatum: string;
    public anschrift: Address;
    public status: string;
    public beruf: string;

    public isValid(): boolean {
        return !!this.name && !!this.vorname && !!this.geburtsdatum && this.anschrift.isValid();
    }
}
