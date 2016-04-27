import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {Offer} from '../../../models/offer';
import {OfferService} from '../../../services/offer.service';
import {DefaultValueService} from '../../../services/default.value.service';
import {CustomerMetadataComponent} from '../metadata/metadata';
import {LvmControl} from '../../controls/lvm.control';
import {Zahlungsweise} from '../../../models/zahlungsweise';
import {LvmCheckbox} from '../../controls/lvm.checkbox';
import {LvmDatePicker} from '../../../directives/datepicker';
import {InteractionService} from '../../../services/interaction.service';
import {Root, ValidationMessage} from 'lvm/core';
import {LvmHelp} from '../../../directives/help';
import {LvmFocus} from '../../../directives/focus';
import {LvmLockedControl} from '../../controls/lvm.locked.control';
import {DataProtectionService} from '../../../services/dataprotection.service';
import {DossierService} from '../../../services/dossier.service';
import {Subscription} from 'rxjs/Subscription';
import {CustomerService} from '../../../services/customer.service';

@Component({
    selector: 'edit-offer',
    directives: [CustomerMetadataComponent, LvmControl, LvmCheckbox, LvmDatePicker, LvmHelp, LvmFocus, LvmLockedControl],
    templateUrl: 'app/components/customer/editoffer/editoffer.html'
})
export class EditOfferComponent implements OnInit, OnDestroy {

    public offer: Offer;
    public isInEditMode: boolean = false;
    public zahlungsweisen: Array<Zahlungsweise>;
    public minBeginn: string;
    public maxErstZulassung: string;
    public maxGebDate: string;

    private subscrSave: Subscription;
    private subscrAction: Subscription;
    private subscrHighlight: Subscription;
    private subscrClose: Subscription;

    public get isProtected(): boolean {
        return this._dataProtectionService.isProtected;
    }

    constructor(private _router: Router, private _routeParams: RouteParams, private _root: Root, private _offerService: OfferService, private _customerService: CustomerService, private _defaultValueService: DefaultValueService, private _interactionService: InteractionService, private _dataProtectionService: DataProtectionService, private _dossierService: DossierService) {
        this.minBeginn = this._defaultValueService.getLocalNow();
        this.maxErstZulassung = this._defaultValueService.getLocalNow();
        this.maxGebDate = this._defaultValueService.getLocalNow();
        this._interactionService.enableScope('editOffer');
        this.subscrSave = this._interactionService.saveRequested$.subscribe(this.onSave.bind(this));
        this.subscrClose = this._interactionService.closeRequested$.subscribe(this.onClose.bind(this));
        this.subscrAction = this._interactionService.actionRequested$.subscribe(this.onActionRequested.bind(this));
        this.subscrHighlight = this._interactionService.highlightFieldRequested$.subscribe(fieldName => {
            this.highlightField(fieldName);
            this.focusField(fieldName)
        });
    }

    public clearRelatedFields() {
        this.offer.fahrzeugdaten.hsn = '';
        this.offer.fahrzeugdaten.typschl = '';
        this.offer.fahrzeugdaten.fahrgestell = '';
    }

    public onGebDateChanged(carrier) {
        this.offer.customer.geburtsdatum = carrier.value;
    }

    public onVersBeginnChanged(carrier) {
        this.offer.versSchutz.versBeginn = carrier.value;
    }

    public onErstzulassungChanged(carrier) {
        this.offer.fahrzeugdaten.erstzulassung = carrier.value;
    }

    public ngOnInit(): any {
        let that = this;
        let offerId: number = this.getOfferId();
        let customerId: number = this.getCustomerId();

        this._offerService.getById(offerId)
            .subscribe(offer => {
                    that.offer = offer;
                    that._customerService.getById(customerId)
                        .subscribe(c=> {
                            that.offer.customer = c;
                            setTimeout(function () {
                                if (offer.angebotId < 0) {
                                    that.enableControls()
                                }
                            }, 10);
                        });
                },
                error => {
                    var newOffer = that._offerService.newOffer(customerId);
                    that._interactionService.requestTreeUpdate();
                    // check if active -> the renavigate else navigate
                    var instr = that._router.generate(['EditOffer', { offerId: newOffer.angebotId }]);
                    if (that._router.root.isRouteActive(instr)) {
                        that._router.renavigate();
                    } else {
                        that._router.navigateByInstruction(instr);
                    }
                });
    }

    public ngOnDestroy(): any {

        this._interactionService.enableScope('customer');
        if (this.subscrAction) {
            this.subscrAction.unsubscribe();
        }
        if (this.subscrHighlight) {
            this.subscrHighlight.unsubscribe();
        }
        if (this.subscrSave) {
            this.subscrSave.unsubscribe();
        }
        if (this.subscrClose) {
            this.subscrClose.unsubscribe();
        }
    }

    private highlightField(fieldName: string): void {
        var field: any = this.getField(fieldName);

        if (!field) {
            return;
        }

        var onBlur = ()=> {
            field.classList.remove('has-error');
            field.removeEventListener('blur', onBlur);
        };

        field.classList.add('has-error');
        field.removeEventListener('blur', onBlur);
        field.addEventListener('blur', onBlur);
    }

    private focusField(fieldName: string): void {
        var field: any = this.getField(fieldName);

        if (!field) {
            return;
        }

        field.focus();
    }

    private getField(fieldName: string): Element {
        return document.querySelector(`[data-field-id="${fieldName}"]`);
    }

    private removeAllFieldHighlightings() {
        var controls = document.querySelectorAll('[data-field-id]');
        for (var i = 0; i < controls.length; i++) {
            controls[i].classList.remove('has-error');
        }
    }

    private onClose() {
        if (!this.isInEditMode) {
            this._interactionService.approveClose();
        } else {
            var shouldContinue = window.confirm('Ungesicherte Daten vorhanden, möchten Sie den Kunden wirklich schließen?');
            if (shouldContinue) {
                this._interactionService.approveClose();
            }
        }
    }

    private onSave() {
        this._dossierService.setDossierModel(this.offer);
    }

    private onActionRequested(action) {
        switch (action) {
            case 'protect':
                this._dataProtectionService.toggleProtectedData();
                break;
            case 'berechnen':
                this.removeAllFieldHighlightings();
                this._offerService.calculate(this.offer)
                    .subscribe(
                        (calculationResult) => console.log(calculationResult),
                        (calculationError) => {
                            var errors = <Array<ValidationMessage>>JSON.parse(calculationError._body);
                            this._root.openValidationResult(errors);
                            errors.forEach(error => this.highlightField(error.bezugsFeld));
                        }
                    );
                break;
            case 'bearbeiten':
                this.enableControls();
                break;
            case 'erstellen':
                this._offerService.create(this.offer).subscribe(()=> {
                    this._router.navigate(['Offers'])
                });
                break;
        }
    }

    private enableControls() {
        var controls = document.querySelectorAll('[data-start-disabled]');
        for (var i = 0; i < controls.length; i++) {
            controls[i]["disabled"] = false;
        }
        this.isInEditMode = true;
        this._interactionService.enableScope('offer');
    }

    private getOfferId(): number {
        return <number>this._routeParams.get('offerId');
    }

    private getCustomerId(): number {
        var rootRouter = this._router;
        while (rootRouter.parent) {
            rootRouter = rootRouter.parent;
        }
        return <number>rootRouter.currentInstruction.component.params["id"];
    }

}
