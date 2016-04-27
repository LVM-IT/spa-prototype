import {Component, Input} from 'angular2/core';

@Component({
    selector: 'las-tick',
    templateUrl: 'app/components/tick/tick.html'
})
export class TickComponent {
    @Input()
    public isTicked: boolean;
}
