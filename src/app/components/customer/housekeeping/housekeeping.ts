import {Component, OnInit, Input} from 'angular2/core';
import {CustomerService} from '../../../services/customer.service';
import {HousekeepingEntry} from '../../../models/housekeepingentry';

@Component({
    selector: 'customer-housekeeping',
    templateUrl: 'app/components/customer/housekeeping/housekeeping.html'
})
export class CustomerHousekeepingComponent implements OnInit {
    public housekeepingEntries: Array<HousekeepingEntry>;

    @Input()
    public customerId: number;

    constructor(private _customerService: CustomerService) {

    }

    public ngOnInit(): any {
        this._customerService.getHousekeepingByCustomerId(this.customerId)
            .subscribe(hk => this.housekeepingEntries = hk);
    }
}
