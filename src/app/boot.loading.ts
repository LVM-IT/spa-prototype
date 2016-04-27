/**
 * Created by th on 18/02/16.
 */
import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {LoadingComponent} from './components/loading/loading';
import {LocationStrategy, HashLocationStrategy} from 'angular2/router';

//enableProdMode();
bootstrap(LoadingComponent, [
    provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
