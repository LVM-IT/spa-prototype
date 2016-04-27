import {Component, Input} from 'angular2/core';
import {Customer} from '../../../models/customer';
import {Root} from 'lvm/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {DossierService} from '../../../services/dossier.service';
import {InteractionService} from '../../../services/interaction.service';
import {OfferService} from '../../../services/offer.service';
import or = protractor.ExpectedConditions.or;

@Component({
    selector: 'button-row',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/customer/buttonrow/buttonrow.html'
})
export class ButtonRowComponent {

    public scope: string = "customer";
    public scopeId: number;

    @Input()
    public customer: Customer;

    @Input('contract-id')
    public contractId: number;

    constructor(private _root: Root, private _router: Router, private _dossierService: DossierService, private _interactionService: InteractionService, private _offerService: OfferService) {
        this._interactionService.scopeEnabled$.subscribe(scopeSettings=> {
            this.scope = scopeSettings.scope;
            this.scopeId = scopeSettings.scopeId;
        });

        this._interactionService.closeApproved$.subscribe(()=> {
            this._dossierService.closeCurentDossier();
            this._router.navigateByInstruction(this._dossierService.getMostRecentInstruction());
        })
    }

    public createLetter() {
        var wizardUrl = `http://localhost:9899/?vertragId=${this.contractId}`;

        this._root.openPopup(wizardUrl, { title: 'Brief erstellen' })
            .then((result) => {
                this._root.openDocument(result.pdfUrl);
            });
    }

    public request(action: string) {
        this._interactionService.requestAction(action);
    }

    public closeCustomer() {

        if (this._dossierService.isSingleDossier()) {
            return;
        }
        this._interactionService.requestClose();
    }

    public createOffer() {
        var newOffer = this._offerService.newOffer(this.customer.partnerId);
        this._router.navigate(['EditOffer', { offerId: newOffer.angebotId }]);
        this._interactionService.requestTreeUpdate();
    }
}
