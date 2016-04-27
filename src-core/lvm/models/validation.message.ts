export class ValidationMessage {
    public fehlerId: number;
    public fehlerKategorie: ValidationMessageType;
    public fehlerText: string;
    public bezugsFeld: string;
}

export enum ValidationMessageType{
    INFO,
    WARNING,
    ERROR
}
