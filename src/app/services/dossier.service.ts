import {Injectable} from 'angular2/core';
import {Dossier} from '../models/dossier';
import {Instruction} from 'angular2/router';
import {RecursiveRouter} from './recursive.router';
import {Offer} from '../models/offer';

@Injectable()
export class DossierService {

    private _dossiers: Array<Dossier>;

    constructor(private _recursiveRouter: RecursiveRouter) {
        this._dossiers = [];
    }

    /**
     * return all dossiers
     * @returns {Array<Dossier>}
     */
    public getAll(): Array<Dossier> {
        return this._dossiers;
    }

    /**
     * create a new dossier
     * @param instruction
     * @param caption
     */
    public createDossier(instruction: Instruction, caption: string) {
        var existing = this.getDossierByInstruction(instruction);
        if (!existing) {
            var newDossier = new Dossier();
            newDossier.instruction = instruction;
            newDossier.caption = caption;
            newDossier.lastUpdate = this.getCurrentTimeAsTicks();
            this._dossiers.push(newDossier);
        }
    }

    /**
     * Returns an existing dossier by the instructions or null if not present
     * @param instruction
     * @returns {any}
     */
    public getDossierByInstruction(instruction: Instruction): Dossier {
        var found = this._dossiers.filter(d=>d.instruction === instruction);
        if (!found || found.length === 0) {
            return null;
        }
        return found[0];
    }

    public isSingleDossier(): boolean {
        return this._dossiers.length === 1;
    }

    public setDossierModel(model: Offer) {
        var dossier = this.getCurrentDossier();
        if (dossier) {
            var offers = dossier.models.filter(o=> o.angebotId === model.angebotId);
            if (offers && offers.length === 1) {
                var index = dossier.models.indexOf(offers[0]);
                dossier.models.splice(index, 1);
            }
            dossier.models.push(model);
        }
    }

    /**
     * close a dossier by it's instructions
     * @param instruction
     */
    public closeDossier(instruction: Instruction) {
        var dossier = this.getDossierByInstruction(instruction);
        if (dossier) {
            this._dossiers.splice(this._dossiers.indexOf(dossier), 1);
        }
    }

    /**
     * update the active dossier
     * @param instruction
     * @param caption
     */
    public updateCurrentDossier(instruction: Instruction, caption: string) {
        var found = this.getCurrentDossier();
        if (found) {
            found.instruction = instruction || found.instruction;
            found.caption = caption || found.caption;
            found.lastUpdate = this.getCurrentTimeAsTicks();
        } else {
            this.createDossier(instruction, caption);
        }
    }

    public closeCurentDossier() {
        var found = this.getCurrentDossier();
        if (found) {
            this.closeDossier(found.instruction);
        }
    }

    public getMostRecentInstruction(): Instruction {
        this._dossiers.sort((a, b) => {
            if (a.lastUpdate < b.lastUpdate) {
                return 1;
            }

            if (a.lastUpdate > b.lastUpdate) {
                return -1;
            }

            return 0;
        });

        return this._dossiers.length > 0 ? this._dossiers[0].instruction : this._recursiveRouter.router.root.generate(['Dashboard']);
    }

    /**
     * Get's the current dossier
     * @returns {any}
     */
    public getCurrentDossier(): Dossier {
        var found = this._dossiers.filter(d => this._recursiveRouter.router.root.isRouteActive(d.instruction));
        if (!found || found.length === 0) {
            return;
        }
        return found[0];
    }

    private getCurrentTimeAsTicks(): number {
        return new Date().getTime();
    }

}
