import {Component, OnInit, Injector} from 'angular2/core';
import {ContractService} from '../../../services/contract.service';
import {Contract} from '../../../models/contract';
import {RouteParams, RouterLink, ComponentInstruction} from 'angular2/router';
import {Subscription} from 'rxjs/Subscription';
import {InteractionService} from '../../../services/interaction.service';

@Component({
    selector: 'customer-contracts',
    templateUrl: 'app/components/customer/contracts/contracts.html',
    directives: [RouterLink]
})
export class CustomerContractsComponent implements OnInit {
    public contracts: Array<Contract>;
    public customerId: number;

    private _closeSubscription: Subscription;

    constructor(private _contractService: ContractService, private injector: Injector, private _interactionService: InteractionService) {
        const routeParams = injector.parent.parent.get(RouteParams);
        this.customerId = parseInt(routeParams.get('id'), 10);
    }

    public ngOnInit(): any {
        this._contractService.getAll(this.customerId)
            .subscribe(
                contracts => this.contracts = contracts,
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
