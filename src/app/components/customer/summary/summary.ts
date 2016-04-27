import {Component, OnInit, Injector} from 'angular2/core';
import {Router, RouteParams, OnActivate, OnDeactivate, ComponentInstruction} from 'angular2/router';
import {CustomerHousekeepingComponent} from '../housekeeping/housekeeping';
import {CustomerHistoryComponent} from '../history/history';
import {OfferService} from '../../../services/offer.service';
import {ProposalService} from '../../../services/proposal.service';
import {ContractService} from '../../../services/contract.service';
import {Contract} from '../../../models/contract';
import {Proposal} from '../../../models/proposal';
import {Offer} from '../../../models/offer';
import {InteractionService} from '../../../services/interaction.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'customer-summary',
    templateUrl: 'app/components/customer/summary/summary.html',
    directives: [CustomerHousekeepingComponent, CustomerHistoryComponent]
})
export class CustomerSummaryComponent implements OnInit, OnActivate, OnDeactivate {
    public contracts: Array<Contract>;
    public proposals: Array<Proposal>;
    public offers: Array<Offer>;
    public customerId: number;

    private _closeSubscription: Subscription;

    constructor(private _router: Router,
                private _offerService: OfferService,
                private _proposalService: ProposalService,
                private _contractService: ContractService,
                private _interactionService: InteractionService,
                private injector: Injector) {
        const routeParams = injector.parent.parent.get(RouteParams);
        this.customerId = parseInt(routeParams.get('id'), 10);
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

    public ngOnInit(): any {
        this._contractService.getAll(this.customerId)
            .subscribe(c => this.contracts = c.splice(0, 3));
        this._proposalService.getAll(this.customerId)
            .subscribe(p => this.proposals = p.splice(0, 3));
        this._offerService.getAll(this.customerId)
            .subscribe(o => this.offers = o.splice(0, 3));
    }
}
