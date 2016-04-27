import {Injectable} from 'angular2/core';
import {Router, Location, Instruction} from 'angular2/router';
import {RouteInstruction} from '../models/route.instruction';

@Injectable()
export class RecursiveRouter {
    private _outstandingChildRoutingUrl: string;

    public get hasOutstandingChildRoutingUrl(): boolean {
        return !!this._outstandingChildRoutingUrl;
    }

    public getAndRemoveOutstandingChildRoutingUrl(): string {
        var temp = this._outstandingChildRoutingUrl;
        this._outstandingChildRoutingUrl = undefined;
        return temp;
    }

    public get router(): Router {
        return this._router;
    }

    constructor(private _router: Router, private _location: Location) {

    }

    /**
     * returns the outstanding path for child frame routing by location path
     * @param {string} locationPath url location path
     * @returns {Promise<any>} Carrier object with instruction and oustandingPath
     */
    public getChildRoute(locationPath: string): Promise<RouteInstruction> {
        // Early exit
        if (!locationPath) {
            return Promise.reject<string>('No instruction found.');
        }
        return this.recognizePathRecursive(locationPath)
            .then(instruction => {
                return new RouteInstruction(locationPath.replace('/' + instruction.toUrlPath(), ''), instruction);
            });
    }

    /**
     *
     * @returns {Promise.<string>} returns the original location where the browser comes from
     */
    public tryNavigateAfterReloading(): Promise<string> {
        const locationPath = this._location.path();

        return this.getChildRoute(locationPath)
            .then((carrier: RouteInstruction)=> {
                this._outstandingChildRoutingUrl = carrier.outstandingPath;
                return this._router.navigateByInstruction(carrier.instruction);
            })
            .then(() => locationPath);
    }

    private recognizePathRecursive(locationPath: string): Promise<Instruction> {
        if (!locationPath) {
            return Promise.reject<Instruction>('No instruction found.');
        }

        return this._router.recognize(locationPath)
            .then(instruction => {
                if (instruction === null) {
                    var newLocationPath = locationPath.slice(0, locationPath.lastIndexOf('/'));
                    return this.recognizePathRecursive(newLocationPath);
                }
                return instruction;
            });
    }
}
