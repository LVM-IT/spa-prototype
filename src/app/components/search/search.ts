import {Component, OnInit} from 'angular2/core';
import {Control} from 'angular2/common';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Observable} from 'rxjs/Observable';
import {ContractService} from '../../services/contract.service';
import {Contract} from '../../models/contract';
import {Observer} from 'rxjs/Observer';
import {DossierService} from '../../services/dossier.service';

@Component({
    selector: 'search',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/search/search.html'
})
export class SearchComponent implements OnInit {

    public items: Array<Customer> = [];
    public term = new Control();
    public showCustomers: boolean = true;
    public showProspects: boolean = true;
    public showOthers: boolean = true;
    public contract: Contract;

    constructor(private _customerService: CustomerService, private _contractService: ContractService, private _dossierService: DossierService, private _router: Router) {

    }

    public onOpenCustomer(customer: Customer) {
        const instructions = this._router.root.generate(['/Customer', {
            id: customer.partnerId
        }]);

        const caption = `Kunde: ${customer.vorname} ${customer.name}`;
        const dossier = this._dossierService.getDossierByInstruction(instructions)
        if (!dossier) {
            this._dossierService.createDossier(instructions, caption);
        }
    }

    public ngOnInit(): any {
        const valueChangedStream = this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged();

        let observer: Observer;
        const contractLoadedObservable = Observable.create(o => observer = o);

        valueChangedStream
            .map(term => parseInt(term, 10))
            .filter(vsnr => !isNaN(vsnr))
            .flatMap(vsnr => this._contractService.get(vsnr))
            .retry()
            .subscribe(contract => {
                    this.contract = contract;
                    console.log('Contract', contract);
                    observer.next(contract.partnerId);
                },
                () => this.contract = null);
        
        valueChangedStream
            .merge(contractLoadedObservable.withLatestFrom(valueChangedStream, (a, b) => a ? a : b))
            .flatMap(term => this._customerService.search(term))
            .subscribe(items => {
                    this.items = items.filter(i=> {
                        var showThisRecord: boolean = true;
                        if (!this.showCustomers && i.status === 'Kunde') {
                            showThisRecord = false;
                        }
                        if (!this.showProspects && i.status === 'Interessent') {
                            showThisRecord = false;
                        }

                        if (!this.showCustomers && i.status !== 'Kunde' && i.status !== 'Interessent') {
                            showThisRecord = false;
                        }
                        return showThisRecord;
                    });
                },
                error => this.items = []
            );
    }
}
