import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../models/customer';
import {HousekeepingEntry} from '../models/housekeepingentry';
import {HistoryEntry} from '../models/historyentry';
import {BaseApiService} from './base.api.service';

@Injectable()
export class CustomerService extends BaseApiService {

    constructor(http: Http) {
        super(http);
    }

    public getAll(): Observable<Array<Customer>> {
        return this.http.get(`${BaseApiService.baseUrl}partners`)
            .map(res => <Array<Customer>>res.json());
    }

    public getById(customerId: number): Observable<Customer> {
        return this.http.get(`${BaseApiService.baseUrl}partner/${customerId}`)
            .map(res => <Customer>res.json());
    }

    public search(query: string): Observable<Array<Customer>> {
        return this.http.get(`${BaseApiService.baseUrl}partners?q=${query}`)
            .map(res=><Array<Customer>>res.json());
    }

    public getHousekeepingByCustomerId(id: number): Observable<Array<HousekeepingEntry>> {
        return this.http.get(`${BaseApiService.baseUrl}partner/${id}/haushalt`)
            .map(res=><Array<HousekeepingEntry>>res.json());
    }

    public getHistoryByCustomerId(id: number): Observable<Array<HistoryEntry>> {
        return this.http.get(`${BaseApiService.baseUrl}partner/${id}/kontakt`)
            .map(res=><Array<HistoryEntry>>res.json());
    }
}
