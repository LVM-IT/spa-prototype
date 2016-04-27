import {Component, Input} from 'angular2/core';

@Component({
    selector: 'lvm-checkbox',
    templateUrl: 'app/components/controls/lvm.checkbox.html'
})
export class LvmCheckbox {
    @Input()
    public caption: string;
}
