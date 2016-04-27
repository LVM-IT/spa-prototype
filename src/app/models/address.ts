export class Address {
    public plz: string;
    public strasse: string;
    public ort: string;
    public stadtteil: string;

    public isValid(): boolean {
        return !!this.plz && !!this.strasse && !!this.ort;
    }
}
