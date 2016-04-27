import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'tel'
})
export class TelPipe implements PipeTransform {
    public transform(value: any, args: any[]) {
        if (!value) {
            return '';
        }

        value = value.replace(/\s/g, '');
        return `tel:${value}`;
    }
}
