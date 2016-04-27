import {Directive, ElementRef, AfterViewInit} from 'angular2/core';

@Directive({
    selector: '[lvm-focus]'
})
export class LvmFocus implements AfterViewInit {
    constructor(private _elementRef: ElementRef) {

    }

    public ngAfterViewInit(): any {
        setTimeout(() => {
            this._elementRef.nativeElement.focus();
        }, 100);
    }
}
