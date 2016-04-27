import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Dossier} from '../../../models/dossier';
import {DossierService} from '../../../services/dossier.service';
import {InteractionService} from '../../../services/interaction.service';

@Component({
    selector: 'dossiers',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/header/dossiers/dossiers.html'
})
export class DossiersComponent implements OnInit {

    public dossiers: Array<Dossier>;

    constructor(private _router: Router, private _dossierService: DossierService, private _interactionService: InteractionService) {
        this._interactionService.switchDossierRequested$.subscribe(d=> {
            this._router.root.navigateByInstruction(d.instruction);
        })
    }

    public ngOnInit(): any {
        this.dossiers = this._dossierService.getAll()
    }

    public switchTo(dossier: Dossier, e) {
        this._interactionService.requestSave();
        this._interactionService.switchToDossier(dossier);
        return false;
    }
}
