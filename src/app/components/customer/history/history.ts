import {Component, OnInit, Input} from 'angular2/core';
import {CustomerService} from '../../../services/customer.service';
import {HistoryEntry} from '../../../models/historyentry';

@Component({
    selector: 'customer-history',
    templateUrl: 'app/components/customer/history/history.html'
})
export class CustomerHistoryComponent implements OnInit{
    public historyEntries: Array<HistoryEntry>;

    @Input()
    public customerId: number;

    constructor(private _customerService: CustomerService){

    }

    public ngOnInit(): any {
        this._customerService.getHistoryByCustomerId(this.customerId)
            .subscribe(he => this.historyEntries = he);
    }
}
