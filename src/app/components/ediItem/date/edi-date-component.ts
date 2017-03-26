import {Component, Input} from '@angular/core';
import {DatePickerOptions, DateModel} from 'ng2-datepicker';
import {Item} from '../../../model/Item';

@Component({
    selector: 'app-edi-date',
    template: `
<!--
        <ng2-datepicker options="options" [(ngModel)]="date"></ng2-datepicker>
-->
    `
})

export class EdiDateComponent {
    options: DatePickerOptions;
    _date: DateModel;
    @Input() item: Item;

    constructor() {
        this.options = new DatePickerOptions();
    }

    set date(value: DateModel) {
        this._date = value;
    }

    get date() {
        return this._date;
    }
}