import {Component, OnInit, OnDestroy} from 'angular2/core';
import {TreeView} from '../../models/tree.view';
import {RouteParams, Location, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {TreeViewItem} from '../../models/tree.view.item';
import {CustomerOverviewTreeViewComponent} from '../customer/treeview/treeview';
import {CustomerService} from '../../services/customer.service';
import {RecursiveRouter} from '../../services/recursive.router';
import {PhoneButtonComponent} from '../phone.button/phone.button';
import {FooterComponent} from '../footer/footer';
import {DossierService} from '../../services/dossier.service';
import {Observable} from 'rxjs/Observable';
import {CustomerSummaryComponent} from '../customer/summary/summary';
import {CustomerContractComponent} from './contract/contract';
import {CustomerOffersComponent} from './offers/offers';
import {CustomerProposalsComponent} from './proposals/proposals';
import {CustomerContractsComponent} from './contracts/contracts';
import {CustomerMetadataComponent} from './metadata/metadata';
import {Customer} from '../../models/customer';
import {ContractService} from '../../services/contract.service';
import {ButtonRowComponent} from './buttonrow/buttonrow';
import {NewDamageComponent} from './newdamage/newdamage';
import {EditOfferComponent} from './editoffer/editoffer';
import {Offer} from '../../models/offer';
import {InteractionService} from '../../services/interaction.service';
import {Subscription} from 'rxjs/Subscription';
import {OfferService} from '../../services/offer.service';

@Component({
    selector: 'customer',
    templateUrl: 'app/components/customer/customer.html',
    directives: [CustomerOverviewTreeViewComponent, FooterComponent, CustomerMetadataComponent, PhoneButtonComponent, ButtonRowComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/summary', name: 'Summary', component: CustomerSummaryComponent, useAsDefault: true },
    { path: '/offers', name: 'Offers', component: CustomerOffersComponent },
    { path: '/offers/:offerId', name: 'EditOffer', component: EditOfferComponent },
    { path: '/contracts', name: 'Contracts', component: CustomerContractsComponent },
    { path: '/proposals', name: 'Proposals', component: CustomerProposalsComponent },
    { path: '/contract/:contractId/createdamage', name: 'CreateDamage', component: NewDamageComponent },
    { path: '/:category/:categoryId', name: 'Contract', component: CustomerContractComponent }
])
export class CustomerComponent implements OnInit, OnDestroy {
    public customer: Customer;
    public treeView: TreeView;
    public customerContracts = {};
    public contractId: number;
    private _routerSubscription: any;
    private _contracts: Array<any>;
    private updateTreeSubscription: Subscription;

    constructor(private _routeParams: RouteParams,
                private _customerService: CustomerService,
                private _contractService: ContractService,
                private _recursiveRouter: RecursiveRouter,
                private _dossierService: DossierService,
                private _offerService: OfferService,
                private _interactionService: InteractionService,
                private _location: Location) {
        this.updateTreeSubscription = this._interactionService.updateTreeRequested$.subscribe(this.buildTreeView.bind(this));
    }

    private static createRootMenuEntry(label: string, children: Array<TreeViewItem>, isExpandedFn?: () => boolean): TreeViewItem {
        const entry = new TreeViewItem(label, null, children);
        entry.isExpanded = isExpandedFn && isExpandedFn();
        return entry;
    }

    private static createCustomerDataMenu(): TreeViewItem {
        return CustomerComponent.createRootMenuEntry('Kundendaten', CustomerComponent.generateSampleLinks());
    }

    private static createHouseholdMenu(): TreeViewItem {
        return CustomerComponent.createRootMenuEntry('Haushalt', CustomerComponent.generateSampleLinks());
    }

    private static createPrecautionMenu(): TreeViewItem {
        return CustomerComponent.createRootMenuEntry('Vorsorge', CustomerComponent.generateSampleLinks());
    }

    private static createDamagesMenu(): TreeViewItem {
        return CustomerComponent.createRootMenuEntry('Schäden', CustomerComponent.generateSampleLinks());
    }

    private static generateSampleLinks(): Array<TreeViewItem> {
        return [
            new TreeViewItem('Sample Link 1'),
            new TreeViewItem('Sample Link 2'),
            new TreeViewItem('Sample Link 3'),
            new TreeViewItem('Sample Link 4'),
        ];
    }

    private static createCustomerContractRoutingInstruction(category: string, categoryId: string) {
        return ['Contract', {
            category: category,
            categoryId: categoryId
        }];
    };

    private static generateCustomerContractTypes(): any {
        return {
            life: true,
            car: true
        };
    }

    public ngOnInit(): any {
        this.loadCustomerByUrlParameter()
            .subscribe();
        this.onRouteChanges(window.location.hash);
        this._routerSubscription = this._recursiveRouter.router.subscribe(this.onRouteChanges.bind(this));

    }

    public ngOnDestroy(): any {
        if (this._routerSubscription) {
            this._routerSubscription.unsubscribe();
        }

    }

    private onRouteChanges(url: string): void {
        let customerCaption = null;
        if (this.customer) {
            customerCaption = `Kunde: ${this.customer.vorname} ${this.customer.name}`;
        }
        this._dossierService.updateCurrentDossier(this._recursiveRouter.router.currentInstruction, customerCaption || null);

        if (url.startsWith('#/')) {
            url = url.substr(2);
        }
        var instructions = url.split('/');
        if (instructions.length > 3) {
            if (instructions[2] === 'vertrag') {
                this.contractId = parseInt(instructions[3]);
            }
        } else {
            this.contractId = null;
        }

        if (this._contracts) {
            this.buildTreeView();
        }
    }

    private loadCustomerByUrlParameter(): Observable<void> {
        const customerId: number = parseInt(this._routeParams.get('id'));
        return this.loadCustomer(customerId);
    }

    private buildTreeView() {
        this.treeView = new TreeView();
        this.treeView.headerLabel = 'Navigation';
        this.treeView.children = [
            this.createOverviewMenu(),
            CustomerComponent.createCustomerDataMenu(),
            CustomerComponent.createHouseholdMenu(),
            this.createOffersMenu(),
            this.createProposalsMenu(),
            this.createContractsMenu(this._contracts),
            CustomerComponent.createPrecautionMenu(),
            CustomerComponent.createDamagesMenu()
        ];
    }

    private createOverviewMenu(): TreeViewItem {
        return CustomerComponent.createRootMenuEntry('Übersicht', [
            new TreeViewItem('Deckblatt', ['Customer', { id: this.customer.partnerId }]),
            new TreeViewItem('Vertriebsassistent')
        ], this.getLocationBasedIsExpandedFunction('summary').bind(this));
    }

    private getRecentOfferNodes(): Array<TreeViewItem> {
        var treeViewItems = [];
        var newOffers = this._offerService.getNewOffers(parseInt(this._routeParams.get('id')));
        if (newOffers) {
            newOffers.forEach(m=> {
                treeViewItems.push(new TreeViewItem(`Angebot ${((<Offer>m).angebotId * -1)}`, ['Customer', { id: this.customer.partnerId }, 'EditOffer', { offerId: (<Offer>m).angebotId }]))
            });

        }
        return treeViewItems;
    }

    private createOffersMenu(): TreeViewItem {
        var recentOffers = this.getRecentOfferNodes();
        var entries = [
            new TreeViewItem('Alle Angebote', ['Customer', { id: this.customer.partnerId }, 'Offers'])
        ];
        return CustomerComponent.createRootMenuEntry('Angebote', entries.concat(recentOffers), this.getLocationBasedIsExpandedFunction('offers').bind(this));
    }

    private createProposalsMenu(): TreeViewItem {
        return CustomerComponent.createRootMenuEntry('Anträge', [
            new TreeViewItem('Alle Anträge', ['Customer', { id: this.customer.partnerId }, 'Proposals'])
        ], this.getLocationBasedIsExpandedFunction('proposals').bind(this));
    }

    private createContractsMenu(contracts: Array<any>) {
        const targetName = 'vertrag';
        const sparten = contracts.map((contract: any) => {
                const item = new TreeViewItem(`${contract.sparte} (${contract.vsnr})`, CustomerComponent.createCustomerContractRoutingInstruction(targetName, contract.vsnr), [
                    new TreeViewItem('Unfall, Udo'),
                    new TreeViewItem('Unfall, Uschi')
                ]);

                item.isExpanded = this.getLocationBasedIsExpandedFunction(`vertrag/${contract.vsnr}`)();

                return item;
            }
        );
        const entries = [new TreeViewItem('Alle Verträge', ['Customer', { id: this.customer.partnerId }, 'Contracts'])];

        return CustomerComponent.createRootMenuEntry('Verträge', entries.concat(sparten), () => {
            const isVertragExpandedFn: () => boolean = this.getLocationBasedIsExpandedFunction(targetName);
            const isContractsExpandedFn: () => boolean = this.getLocationBasedIsExpandedFunction('contracts');

            return isVertragExpandedFn() || isContractsExpandedFn();
        });
    }

    private getLocationBasedIsExpandedFunction(locationPart: string): () => boolean {
        return () => this._location.path().indexOf(locationPart.toLowerCase()) > -1;
    }

    private loadCustomer(customerId: number): Observable<void> {
        return this._customerService.getById(customerId)
            .flatMap(customer => {
                this.customer = customer;
                this._dossierService.updateCurrentDossier(this._recursiveRouter.router.root.currentInstruction, `Kunde: ${this.customer.vorname} ${this.customer.name}`);
                return this._contractService.getAll(customerId);
            })
            .do((contracts: Array<any>) => {
                this.customerContracts = CustomerComponent.generateCustomerContractTypes();
                this._contracts = contracts;
                this.buildTreeView();
            });
    }
}
