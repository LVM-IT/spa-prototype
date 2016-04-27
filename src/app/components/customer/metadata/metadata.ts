import {Component, Input} from 'angular2/core';
import {Customer} from '../../../models/customer';
import {Root} from 'lvm/core';

@Component({
    selector: 'customer-metadata',
    templateUrl: 'app/components/customer/metadata/metadata.html'
})
export class CustomerMetadataComponent {
    public isInEditMode: boolean = false;
    public isSaving: boolean = false;
    public isMinimized: boolean = navigator.userAgent.match(/iPad/i) != null;

    @Input()
    public customer: Customer;

    private _originalCustomer: Customer = null;

    constructor(private _lasRoot: Root) {

    }

    public startEditMode() {
        this._originalCustomer = <Customer>JSON.parse(JSON.stringify(this.customer));
        this.isInEditMode = true;
    }

    public cancelChanges() {
        this.customer = this._originalCustomer;
        this._originalCustomer = null;
        this.isInEditMode = false;
    }

    public saveChanges() {
        this.isSaving = true;

        setTimeout(() => {
            this.onSaved();
        }, 250);
    }

    public openJobSelection() {
        this._lasRoot.openPopup('http://localhost:9898/', { title: 'LAS Berufsuche' })
            .then(result => this.customer.beruf = result.name);
    }

    private onSaved() {
        this.isSaving = false;
        this._originalCustomer = null;
        this.isInEditMode = false;
    }
}
