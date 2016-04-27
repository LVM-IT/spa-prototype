import {Component, OnInit} from 'angular2/core';
import {MailboxService} from '../../services/mailbox.service';
import {MailboxEntry} from '../../models/mailboxentry';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {DossierService} from '../../services/dossier.service';

@Component({
    selector: 'mailbox',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/mailbox/mailbox.html'
})
export class MailboxComponent implements OnInit {
    public mailboxEntries: Array<MailboxEntry>;

    constructor(private _mailboxService: MailboxService, private _dossierService: DossierService, private _router: Router) {

    }

    public ngOnInit(): any {
        this._dossierService.updateCurrentDossier(this._router.root.currentInstruction, 'Briefkasten');
        this._mailboxService.getAll()
            .subscribe(mailboxEntries => this.mailboxEntries = mailboxEntries);
    }

    public goToCustomer(partnerId: number) {
        var instructions = this._router.root.generate(['/Customer', {
            id: partnerId
        }]);

        this._dossierService.createDossier(instructions, 'Kunde');
        this._router.navigateByInstruction(instructions);
    }

    public goToContract(partnerId: number, contractId: number) {
        var instructions = this._router.root.generate(['/Customer', {
            id: partnerId
        }, 'Contract', {
            category: 'vertrag',
            categoryId: contractId
        }]);

        this._dossierService.createDossier(instructions, 'Kunde');
        this._router.navigateByInstruction(instructions);
    }

}
