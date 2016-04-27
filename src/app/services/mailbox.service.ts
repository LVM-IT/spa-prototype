import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {MailboxEntry} from '../models/mailboxentry';
import {Observable} from 'rxjs/Observable';
import {CustomerService} from './customer.service';
import {BaseApiService} from './base.api.service';

@Injectable()
export class MailboxService extends BaseApiService {

    constructor(http: Http, private _customerService: CustomerService) {
        super(http);
    }

    public getAll(): Observable<Array<MailboxEntry>> {
        return this.http.get(`${BaseApiService.baseUrl}briefkasten/m50000`)
            .flatMap(res=> Observable.from(<Array<MailboxEntry>>res.json()))
            .flatMap((entry: MailboxEntry) => {
                return this._customerService.getById(entry.partnerId)
                    .map(customer => {
                        entry.partnerName = `${customer.vorname} ${customer.name}`;
                        return entry;
                    });

            })
            .toArray();
    }
}
