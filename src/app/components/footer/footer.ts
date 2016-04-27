import {Component, Input} from 'angular2/core';
import {TickComponent} from '../tick/tick';

@Component({
    selector: 'las-footer',
    templateUrl: 'app/components/footer/footer.html',
    directives: [TickComponent]
})
export class FooterComponent {
    @Input()
    public customerContract = {};
}
