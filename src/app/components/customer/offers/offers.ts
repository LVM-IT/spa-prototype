import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {OfferService} from '../../../services/offer.service';
import {Offer} from '../../../models/offer';
import {Subscription} from 'rxjs/Subscription';
import {InteractionService} from '../../../services/interaction.service';

@Component({
    selector: 'customer-offers',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/customer/offers/offers.html'
})
export class CustomerOffersComponent implements OnInit {
    public offers: Array<Offer>;
    public customerId: number;

    private _closeSubscription: Subscription;

    constructor(private injector: Injector, private _offerService: OfferService, private _interactionService: InteractionService) {

        const routeParams = injector.parent.parent.get(RouteParams);
        this.customerId = parseInt(routeParams.get('id'), 10);
    }

    public ngOnInit(): any {
        this.refresh();
    }

    public routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any|Promise<any> {
        this._closeSubscription = this._interactionService.closeRequested$.subscribe(()=> this._interactionService.approveClose());
        return undefined;
    }

    public routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any|Promise<any> {
        if (this._closeSubscription) {
            this._closeSubscription.unsubscribe();
        }
        return undefined;
    }

    public copyOffer(angebotId: number): void {
        this._offerService.copy(angebotId)
            .subscribe(() => this.refresh());
    }

    private refresh(): void {
        this._offerService.getAll(this.customerId)
            .subscribe(offers => this.offers = offers);
    }
}
