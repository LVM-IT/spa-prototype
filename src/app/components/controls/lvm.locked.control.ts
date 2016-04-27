import {Component, Input, ElementRef, OnInit} from 'angular2/core';
import {Log} from 'lvm/core';

@Component({
    selector: 'lvm-locked-control',
    templateUrl: 'app/components/controls/lvm.locked.control.html'
})
export class LvmLockedControl implements OnInit {
    @Input() public caption: string;

    @Input() public helpText: string;

    @Input() public helpCaption: string;

    private _input: any;

    constructor(private _elementRef: ElementRef) {

    }

    public ngOnInit(): any {
        if (!this._input) {

            var inputFields = this._elementRef.nativeElement.getElementsByTagName('input');
            if (inputFields && inputFields.length > 0) {
                this._input = inputFields[0];
            }
        }
        this._input.disabled = true;
    }

    public unlockControl() {
        Log.log(`LvmLockedControl: User unlocked control '${this.caption}'`);
        this._input.disabled = false;
    }
}

