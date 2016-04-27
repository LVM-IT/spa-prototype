import {Directive, ElementRef, Input, EventEmitter, Output, AfterViewInit} from 'angular2/core';

declare var $: any;

@Directive({
    selector: '[datepicker]'
})
export class LvmDatePicker implements AfterViewInit {

    private _minDate: string;
    private _orientation: string;
    private _maxDate: string;
    private _initValue: string;

    constructor(private _elementRef: ElementRef) {

    }

    @Input()
    public set minDate(minDate: string) {
        this._minDate = minDate;
    }

    @Input()
    public set maxDate(maxDate: string) {
        this._maxDate = maxDate;
    }

    @Input()
    public set orientation(o: string) {
        this._orientation = o;
    }

    @Input()
    public set initValue(initValue: string) {
        this._initValue = initValue;
    }

    /* tslint:disable:member-ordering */
    @Output() public onDateChanged = new EventEmitter();

    public ngAfterViewInit(): any {

        var props = {
            language: 'de',
            calendarWeeks: true,
            autoclose: true,
            orientation: this._orientation,
            startDate: this._minDate,
            endDate: this._maxDate,
            showOnFocus: true
        };
        if (!this._minDate) {
            delete props.startDate;
        }
        if (!this._maxDate) {
            delete props.endDate;
        }

        if (!this._orientation) {
            delete props.orientation;
        }
        this._elementRef.nativeElement.value = this._initValue;
        $(`#${this._elementRef.nativeElement.id}`)
            .datepicker(props)
            .on('changeDate', e => {
                this.onDateChanged.emit({ value: ("0" + e.date.getDate()).slice(-2) + "." + ("0" + (e.date.getMonth() + 1)).slice(-2) + "." + e.date.getFullYear() });
            });
    }
}
