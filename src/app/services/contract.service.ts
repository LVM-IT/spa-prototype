import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Contract} from '../models/contract';
import {BaseApiService} from './base.api.service';

@Injectable()
export class ContractService extends BaseApiService {

    constructor(http: Http) {
        super(http);
    }

    public getAll(partnerId: number): Observable<Array<Contract>> {
        return this.http.get(`${BaseApiService.baseUrl}vertraege?partnerId=${partnerId}`)
            .map(r => <Array<Contract>>r.json());
    }

    public get(contractId: number): Observable<Contract> {
        return this.http.get(`${BaseApiService.baseUrl}vertrag/${contractId}`)
            .map(r => <Contract>r.json());
    }
}
