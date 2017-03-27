import {Component, Input} from '@angular/core';
import {Item} from '../../../model/Item';
import {IMyDateModel, IMyOptions} from 'mydatepicker';

@Component({
    selector: 'app-edi-date',
    template: `
        <my-date-picker [options]="myDatePickerOptions"
                        (dateChanged)="onDateChanged($event)"></my-date-picker>
    `
})

export class EdiDateComponent {
/*
    options: DatePickerOptions;
    _date: DateModel;
*/
    @Input() item: Item;

    private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    constructor() { }

    // dateChanged callback function called when the user select the date. This is mandatory callback
    // in this option. There are also optional inputFieldChanged and calendarViewChanged callbacks.
    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
        this.item.value = event.formatted;
        console.log('date changed to', this.item);
    }
}