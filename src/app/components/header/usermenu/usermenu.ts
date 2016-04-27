import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'user-menu',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/header/usermenu/usermenu.html'
})
export class UserMenuComponent {

    constructor() {

    }
}
