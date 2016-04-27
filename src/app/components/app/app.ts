import {Component, provide, ViewChild} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';
import {HeaderComponent} from '../header/header';
import {SearchComponent} from '../search/search';
import {CustomerListComponent} from '../customer/list/list';
import {Root, PopupOptions, ValidationMessage} from 'lvm/core';
import {RecursiveRouter} from '../../services/recursive.router';
import {CustomerComponent} from '../customer/customer';
import {ModalComponent} from '../modal/modal';
import {MailboxComponent} from '../mailbox/mailbox';
import {InteractionService} from '../../services/interaction.service';
import {CustomerService} from '../../services/customer.service';
import {DossierService} from '../../services/dossier.service';
import {MailboxService} from '../../services/mailbox.service';
import {OfferService} from '../../services/offer.service';
import {ContractService} from '../../services/contract.service';
import {ProposalService} from '../../services/proposal.service';
import {DefaultValueService} from '../../services/default.value.service';
import {DamageService} from '../../services/damage.service';
import {DataProtectionService} from '../../services/dataprotection.service';

@Component({
    selector: 'lvm-app',
    directives: [HeaderComponent, ModalComponent, ROUTER_DIRECTIVES],
    providers: [
        provide(Root, { useClass: Root }),
        RecursiveRouter,
        provide(CustomerService, { useClass: CustomerService }),
        provide(DossierService, { useClass: DossierService }),
        provide(MailboxService, { useClass: MailboxService }),
        provide(OfferService, { useClass: OfferService }),
        provide(ContractService, { useClass: ContractService }),
        provide(ProposalService, { useClass: ProposalService }),
        provide(DefaultValueService, { useClass: DefaultValueService }),
        provide(InteractionService, { useClass: InteractionService }),
        provide(DamageService, { useClass: DamageService }),
        provide(DataProtectionService, { useClass: DataProtectionService })
    ],
    templateUrl: 'app/components/app/app.html'
})
@RouteConfig([
    { path: '/', name: 'Dashboard', component: SearchComponent, useAsDefault: true },
    { path: '/mailbox', name: 'Mailbox', component: MailboxComponent },
    { path: '/customer/list', name: 'CustomerList', component: CustomerListComponent },
    { path: '/customer/:id/...', name: 'Customer', component: CustomerComponent }
])
export class AppComponent {

    private _openPopupRequested: boolean;
    private _closePopupRequested: boolean;
    private _popupUrl: string;
    private _messages: Array<string>;
    private _currentInstruction: string;

    @ViewChild(ModalComponent)
    private _lasModal: ModalComponent;

    constructor(private _lasApp: Root, private _router: Router, private _location: Location, recursiveRouter: RecursiveRouter, private _interactionService: InteractionService) {
        this._messages = [];
        this._lasApp.onOpenPopup = this.onOpenPopupRequested.bind(this);
        this._lasApp.onClosePopup = this.onClosePopupRequested.bind(this);
        this._lasApp.onRouteChanged = this.onRouteChanged.bind(this);
        this._lasApp.onOpenDocument = this.onOpenDocumentRequested.bind(this);
        this._lasApp.onOpenValidationResult = this.onOpenValidationResult.bind(this);
        this._lasApp.onRootInstructionRequested = this.onRootInstructionRequested.bind(this);
        this._interactionService.registerGlobalShortcut('ALT+SHIFT|S', 'erstellen');
        this._interactionService.registerGlobalShortcut('ALT+SHIFT|B', 'berechnen');

        recursiveRouter.tryNavigateAfterReloading()
            .then(originalLocation => _lasApp.browserHistory.replaceTo(this._location.prepareExternalUrl(originalLocation)),
                err => console.log('No navigation required after reloading', err));

        this._router.subscribe(currentInstruction => {
            this._currentInstruction = currentInstruction;
        });
    }

    public onRootInstructionRequested(): string {
        const location = window.location;
        const browserUrl = `${location.protocol}//${location.host}/${this._location.prepareExternalUrl(this._currentInstruction)}`;
        return browserUrl;
    }

    public onRouteChanged(route: string, replaceBrowserHistory: boolean) {
        const browserUrl = this._location.prepareExternalUrl(this._currentInstruction + route);
        const updateFn = replaceBrowserHistory ? this._lasApp.browserHistory.replaceTo : this._lasApp.browserHistory.changeTo;
        updateFn(browserUrl);
    }

    public onOpenPopupRequested(url: string, options: PopupOptions, openerWidgetId: string, messageId: string) {
        this._openPopupRequested = true;
        this._popupUrl = url;
        this._lasModal.show(url, options.title, openerWidgetId, messageId);
    }

    public onClosePopupRequested() {
        this._popupUrl = 'loading.html';
        this._closePopupRequested = true;
        this._lasModal.close();
    }

    public onOpenValidationResult(errors: Array<ValidationMessage>) {
        this._lasModal.showValidationResult(errors);
    }

    public onOpenDocumentRequested(url: string) {
        if (url) {
            window.open(url, '_blank');
        }
    }
}
