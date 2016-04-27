import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Offer} from '../models/offer';
import {BaseApiService} from './base.api.service';

@Injectable()
export class OfferService extends BaseApiService {

    private _offers: Array<Offer>;

    constructor(http: Http) {
        super(http);
        this._offers = [];
    }

    public newOffer(partnerId: number): Offer {
        var offer = new Offer((this._offers.length + 1) * -1, partnerId);
        this._offers.push(offer);
        return offer;

    }

    public calculate(offer: Offer) {
        return this.http.post(`${BaseApiService.baseUrl}angebot/${offer.sparte.toLowerCase()}/berechnen`, JSON.stringify(offer), this.postOptions)
            .map(r=>r.json());
    }

    public create(offer: Offer) {
        var copy = JSON.parse(JSON.stringify(offer));
        delete copy.customer;
        delete copy.persisted;
        if (copy.angebotId < 0) {
            this.removeFromTempStorage(copy.angebotId);
        }
        copy.angebotId = 0;
        return this.http.post(`${BaseApiService.baseUrl}angebot`, JSON.stringify(copy), this.postOptions)
            .map(r=>r.json());
    }

    public getAll(partnerId: number): Observable<Array<Offer>> {
        return this.http.get(`${BaseApiService.baseUrl}angebote?partnerId=${partnerId}`)
            .map(r => {
                let offers = <Array<Offer>>r.json();
                offers = offers.concat(this._offers.filter(o => o.partnerId === partnerId));
                return offers;
            });
    }

    public getNewOffers(partnerId: number): Array<Offer> {
        return this._offers.filter(o=>o.partnerId === partnerId);
    }

    public getById(angebotId: number): Observable<Offer> {
        if (angebotId < 0) {
            return Observable.create(obs=> {
                var found = this._offers.filter(o=>o.angebotId === angebotId);
                if (found && found.length > 0) {
                    obs.next(found[0]);
                    obs.complete();
                } else {
                    obs.error('not found');
                }
            });
        }
        return this.http.get(`${BaseApiService.baseUrl}angebot/${angebotId}`)
            .map(r => <Offer>r.json());
    }

    public copy(angebotId: number): Observable<any> {
        return this.http.post(`${BaseApiService.baseUrl}angebot/${angebotId}`, null);
    }

    private removeFromTempStorage(id: number) {
        var angebote = this._offers.filter(o=>o.angebotId === id);
        if (angebote && angebote.length > 0) {
            var idx = this._offers.indexOf(angebote[0]);
            this._offers.splice(idx, 1);
        }
    }
}
