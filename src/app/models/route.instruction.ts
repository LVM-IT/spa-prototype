import {ResolvedInstruction} from 'angular2/src/router/instruction';

export class RouteInstruction {
    constructor(public outstandingPath: string, public instruction: ResolvedInstruction) {

    }
}
