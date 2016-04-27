/**
 * Created by th on 18/02/16.
 */
import {bootstrap} from 'angular2/platform/browser'
import {enableProdMode, provide} from 'angular2/core';
import {AppComponent} from './components/app/app';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import 'rxjs/Rx';

//enableProdMode();
bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, 
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
