import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Damage, DamageDefaults} from '../models/damage';
import {Http} from 'angular2/http';
import {BaseApiService} from './base.api.service';

@Injectable()
export class DamageService extends BaseApiService {

    constructor(http: Http) {
        super(http);
    }

    public getDefaults(sparte: string): Observable<DamageDefaults> {
        return this.http.get(`${BaseApiService.baseUrl}schaden/${sparte}/vorbelegung`)
            .map(r=><DamageDefaults>r.json());
    }

    public create(damage: Damage): Observable<any> {
        return this.http.post(`${BaseApiService.baseUrl}schaden`, JSON.stringify(damage), this.postOptions)
            .map(r=>r.json());
    }
}
