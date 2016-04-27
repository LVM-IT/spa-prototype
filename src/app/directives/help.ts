import {Directive, HostListener, ElementRef} from 'angular2/core';
declare var $ : any;
@Directive({
    selector:'[help]'
})
export class LvmHelp {

    constructor(private _elementRef: ElementRef){

    }

    @HostListener('keyup', ['$event'])
    public onKeyUp(e) {
        // F1 is pressed
        if(e.keyCode===112){
            var formGroup = this.getFormGroup(this._elementRef.nativeElement.parentElement);
            if(formGroup){
                $(formGroup).popover('toggle')
            }
            e.stopPropagation();
        }
        if(e.keyCode===27){
            var formGroup = this.getFormGroup(this._elementRef.nativeElement.parentElement);
            if(formGroup){
                $(formGroup).popover('hide')
            }
            e.stopPropagation();
        }

    }

    @HostListener('blur', ['$event'])
    public onBlur(e){
        var formGroup = this.getFormGroup(this._elementRef.nativeElement.parentElement);
        if(formGroup){
            $(formGroup).popover('hide');
        }
    }

    private getFormGroup(node){
        while(!node.classList.contains('form-group')){
            node = node.parentElement;
        }
        return node;
    }

}
