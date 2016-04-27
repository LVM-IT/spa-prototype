import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Proposal} from '../models/proposal';
import {BaseApiService} from './base.api.service';

@Injectable()
export class ProposalService extends BaseApiService {
    
    constructor(http: Http) {
        super(http);
    }

    public getAll(partnerId: number): Observable<Array<Proposal>> {
        return this.http.get(`${BaseApiService.baseUrl}antraege?partnerId=${partnerId}`)
            .map(r => <Array<Proposal>>r.json());
    }
}
