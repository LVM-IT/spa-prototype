import {Component, Input} from 'angular2/core';

@Component({
    selector: 'lvm-control',
    templateUrl: 'app/components/controls/lvm.control.html'
})
export class LvmControl {

    @Input() public caption: string;

    @Input() public helpText: string;

    @Input() public helpCaption: string;

    @Input() public isProtected: boolean;
}

