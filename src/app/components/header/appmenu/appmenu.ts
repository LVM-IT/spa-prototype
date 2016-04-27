import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {DossierService} from '../../../services/dossier.service';
import {InteractionService} from '../../../services/interaction.service';

@Component({
    selector: 'app-menu',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/header/appmenu/appmenu.html'
})
export class AppMenuComponent {

    constructor(private _router: Router, private _dossierService: DossierService, private _interactionService: InteractionService) {

    }

    public navigateToMailbox() {
        this._interactionService.requestSave();

        let caption = 'Briefkasten',
            instructions = this._router.generate(['/Mailbox']);

        const dossiers = this._dossierService.getAll();
        const dossier = dossiers.find(d => d.caption === caption);

        if (!dossier) {
            this._dossierService.createDossier(instructions, caption);
        }

        this._router.navigateByInstruction(instructions);

    }
}
