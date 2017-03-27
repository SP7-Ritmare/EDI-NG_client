
import {Component, Input} from '@angular/core';
import {IMyDateRangeModel, IMyOptions} from 'mydaterangepicker';
import {Item} from '../../../model/Item';
@Component({
    selector: 'app-edi-date-range',
    template: `
        <my-date-range-picker [options]="myDateRangePickerOptions"
                              (dateRangeChanged)="onDateRangeChanged($event)"></my-date-range-picker>
    `
})

export class EdiDateRangeComponent {
    @Input() item: Item;
    private myDateRangePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    constructor() { }

    // dateRangeChanged callback function called when the user apply the date range. This is
    // mandatory callback in this option. There are also optional inputFieldChanged and
    // calendarViewChanged callbacks.
    onDateRangeChanged(event: IMyDateRangeModel) {
        // event properties are: event.beginDate, event.endDate, event.formatted,
        // event.beginEpoc and event.endEpoc
        console.log('onDateRangeChanged(): Formatted: ', event.beginDate, event.endDate);
    }
}