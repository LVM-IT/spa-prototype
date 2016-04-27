import {Component, OnDestroy, OnInit} from 'angular2/core';
import {InteractionService} from '../../../services/interaction.service';
import {LvmDatePicker} from '../../../directives/datepicker';
import {LvmCheckbox} from '../../controls/lvm.checkbox';
import {LvmControl} from '../../controls/lvm.control';
import {Damage} from '../../../models/damage';
import {DamageService} from '../../../services/damage.service';
import {Router, RouteParams, ComponentInstruction} from 'angular2/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'new-damage',
    directives: [LvmControl, LvmCheckbox, LvmDatePicker],
    templateUrl: 'app/components/customer/newdamage/newdamage.html'
})
export class NewDamageComponent implements OnInit, OnDestroy {
    public damage: Damage;
    public today: string;

    private _closeSubscription: Subscription;

    constructor(private _interactionService: InteractionService, private _damageService: DamageService, private _router: Router, private _routeParams: RouteParams) {
        this.damage = new Damage();
        var d = new Date();
        this.today = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
    }

    public ngOnInit(): any {
        this._interactionService.enableScope('damage');

        let contractId = <number>this._routeParams.get('contractId');
        this.damage.contractId = contractId;
        this._interactionService.actionRequested$.subscribe((action)=> {
            switch (action) {
                case "erstellen":
                    this._damageService.create(this.damage)
                        .subscribe(()=> {
                            this._router.navigate(['Contract', { category: 'vertrag', categoryId: contractId }]);
                        });
            }
        });
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

    public ngOnDestroy(): any {
        this._interactionService.enableScope('customer');
    }

}
