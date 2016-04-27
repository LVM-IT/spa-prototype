import {Injectable} from 'angular2/core';
import {RequestOptions, Headers, Http} from 'angular2/http';

@Injectable()
export class BaseApiService {

    private _options: RequestOptions;

    constructor(private _http: Http) {

    }

    protected static get baseUrl(): string {
        return "http://lvm-rest-api.azurewebsites.net/";
    }

    protected get http(): Http {
        return this._http;
    }

    protected get postOptions(): RequestOptions {
        if (!this._options) {
            this._options = new RequestOptions();
            this._options.headers = new Headers();
            this._options.headers.append('accept', 'application/json');
            this._options.headers.append('Content-Type', 'application/json');
        }
        return this._options;
    }
}
