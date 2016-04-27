import {Component, OnInit} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';
import {PhoneButtonComponent} from '../../phone.button/phone.button';
import {Customer} from '../../../models/customer';
import {CustomerService} from '../../../services/customer.service';
import {DossierService} from '../../../services/dossier.service';
import {OfferService} from '../../../services/offer.service';
import {InteractionService} from '../../../services/interaction.service';

@Component({
    directives: [RouterLink, PhoneButtonComponent],
    selector: 'customer-list',
    templateUrl: 'app/components/customer/list/list.html'
})
export class CustomerListComponent implements OnInit {
    private _customers: Array<Customer>;

    constructor(private _customerService: CustomerService, private _dossierService: DossierService, private _offerService: OfferService, private _interactionService: InteractionService, private _router: Router) {

    }

    public ngOnInit(): any {
        this._customerService.getAll()
            .subscribe(customers => this._customers = customers.filter((c)=>c.status === 'Kunde'));
    }

    public createDossier(customer) {
        const instructions = this._router.generate(['/Customer', {
            id: customer.partnerId
        }]);

        const caption = `Kunde: ${customer.vorname} ${customer.name}`;
        const dossiers = this._dossierService.getAll();
        const dossier = dossiers.find(d => d.caption === caption);

        if (!dossier) {
            this._dossierService.createDossier(instructions, caption);
        }
    }

    public createOffer(customer: Customer) {
        var newOffer = this._offerService.newOffer(customer.partnerId);
        this._router.navigate(['EditOffer', { offerId: newOffer.angebotId }]);
        this._interactionService.requestTreeUpdate();
    }
}
