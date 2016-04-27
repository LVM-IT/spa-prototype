import {Injectable} from 'angular2/core';
import {DefaultValues} from '../models/defaultvalues';
import {Observable} from 'rxjs/Observable';
import {Http} from 'angular2/http';
import {BaseApiService} from './base.api.service';

@Injectable()
export class DefaultValueService extends BaseApiService {

    constructor(http: Http) {
        super(http);
    }

    public getKraftfahrtDefaultValues(customerId: number): Observable<DefaultValues> {
        return this.http.get(`${BaseApiService.baseUrl}angebot/kraftfahrt/vorbelegung/?partnerId=${customerId}`)
            .map(r=> <DefaultValues>r.json());
    }

    public getLocalNow(): string {
        var d = new Date();
        return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
    }
}
