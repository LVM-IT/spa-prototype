import {Guid} from 'lvm/core';
import {Instruction} from 'angular2/router';

export class Dossier {
    public id: string;
    public instruction: Instruction;
    public caption: string;
    public models: Array<any>;
    public lastUpdate: number;
    
    constructor() {
        this.id = Guid.NewGuid();
        this.models = [];
    }
}
