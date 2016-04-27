import {Component, Input, OnInit, ElementRef, Injector, OnDestroy} from 'angular2/core';
import {RouteParams, CanReuse, ComponentInstruction} from 'angular2/router';
import {RecursiveRouter} from '../../../services/recursive.router';
import {InteractionService} from '../../../services/interaction.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'customer-contract',
    templateUrl: 'app/components/customer/contract/contract.html'
})
export class CustomerContractComponent implements OnInit, OnDestroy, CanReuse {

    @Input()
    public iFrameSource: string;
    public contractId: number;

    private _baseUrl: string = 'http://localhost:9999/';
    private _closeSubscription: Subscription;

    constructor(private _elementRef: ElementRef, private _recursiveRouter: RecursiveRouter, injector: Injector, private _interactionService: InteractionService) {
        const routeParams = injector.parent.get(RouteParams);
        this.setParameters({
            categoryId: routeParams.get('categoryId')
        });
    }

    public ngOnInit(): any {
        this.setIFrameSource();
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

    public routerCanReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): boolean|Promise<boolean> {
        this.setParameters(nextInstruction.params);
        this.setIFrameSource();

        return true;
    }

    private setIFrameSource() {
        const iFrameSourceBase = `${this._baseUrl}/#`;
        let relativeIFrameUrl = `/${this.contractId}/overview`;

        if (this._recursiveRouter.hasOutstandingChildRoutingUrl) {
            relativeIFrameUrl = this._recursiveRouter.getAndRemoveOutstandingChildRoutingUrl();
        }

        this.iFrameSource = iFrameSourceBase + relativeIFrameUrl;

        this._elementRef.nativeElement.classList.add('max-flex-height', 'flex-container');

        this._interactionService.enableScope('contract', this.contractId);
    }

    private setParameters(routeParams) {
        this.contractId = routeParams.categoryId;
    }

}
