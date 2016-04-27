import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {DossiersComponent} from './dossiers/dossiers';
import {AppMenuComponent} from './appmenu/appmenu';
import {UserMenuComponent} from './usermenu/usermenu';
import {InteractionService} from '../../services/interaction.service';
import {DataProtectionService} from '../../services/dataprotection.service';

@Component({
    selector: 'las-header',
    directives: [ROUTER_DIRECTIVES, DossiersComponent, AppMenuComponent, UserMenuComponent],
    templateUrl: 'app/components/header/header.html'
})
export class HeaderComponent {

    constructor(private _interactionService: InteractionService, private _dataProtectionService: DataProtectionService) {

    }

    public togglePrivacy() {
        this._interactionService.requestAction('protect');
    }

    public get isProtected(): boolean {
        return this._dataProtectionService.isProtected;

    }

    public injectClick() {
        this._interactionService.requestSave();
    }
}
