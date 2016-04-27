import {Component, OnInit, Injector} from 'angular2/core';
import {Proposal} from '../../../models/proposal';
import {ProposalService} from '../../../services/proposal.service';
import {RouteParams, ComponentInstruction} from 'angular2/router';
import {Subscription} from 'rxjs/Subscription';
import {InteractionService} from '../../../services/interaction.service';

@Component({
    selector: 'customer-proposals',
    templateUrl: 'app/components/customer/proposals/proposals.html'
})
export class CustomerProposalsComponent implements OnInit {
    public customerId: number;
    public proposals: Array<Proposal>;

    private _closeSubscription: Subscription;

    constructor(private _proposalService: ProposalService, injector: Injector, private _interactionService: InteractionService) {
        const routeParams = injector.parent.parent.get(RouteParams);
        this.customerId = parseInt(routeParams.get('id'), 10);
    }

    public ngOnInit(): any {
        this._proposalService.getAll(this.customerId)
            .subscribe(
                proposals => this.proposals = proposals,
                error => console.log(error)
            );
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
}
