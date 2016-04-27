import {Component, Input} from 'angular2/core';
import {TelPipe} from '../../pipes/tel.pipe';

@Component({
    selector: 'las-phone-button',
    pipes: [TelPipe],
    templateUrl: 'app/components/phone.button/phone.button.html'
})
export class PhoneButtonComponent {
    @Input()
    public phone;
}
