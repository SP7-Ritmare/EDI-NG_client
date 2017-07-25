import {Component, Input} from '@angular/core';
import {Item} from '../../../model/Item';
import {IMyDateModel, IMyOptions} from 'mydatepicker';
import {TimePickerValue} from '../time-picker/time-picker.component';
import {EDITemplate} from '../../service/EDITemplate';

@Component({
    selector: 'app-edi-date',
    template: `
        <my-date-picker [options]="myDatePickerOptions"
                        (dateChanged)="onDateChanged($event)"></my-date-picker>
        <time-picker *ngIf="hasTime" (timeChange)="timeChanged($event)"></time-picker>
        <pre>{{toString()}}</pre>
    `
})

export class EdiDateComponent {
/*
    options: DatePickerOptions;
    _date: DateModel;
*/
    @Input() item: Item;
    @Input() hasTime: boolean = false;

    time: TimePickerValue = {
        hours: '0',
        minutes: '0',
        seconds: '0',
        timezone: 'CUT'
    }
    date: string = null;

    private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    private pad(num: string, size: number) {
        var s = "000000000" + parseInt(num);
        return s.substr(s.length-size);
    }

    private toString() {
        return this.date + 'T' + this.pad(this.time.hours, 2) + ':' + this.pad(this.time.minutes, 2) + ':' + this.pad(this.time.seconds, 2) + (this.template.getTimezone(this.time.timezone).forrmattedOffset) + 'Z';
    }

    constructor(public template: EDITemplate) { }

    // dateChanged callback function called when the user select the date. This is mandatory callback
    // in this option. There are also optional inputFieldChanged and calendarViewChanged callbacks.
    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
        this.date = event.formatted;
        this.item.value = this.toString();
        console.log('date changed to', this.item.value);
    }

    timeChanged(event: TimePickerValue) {
        this.time = event;
        this.item.value = this.toString();
        console.log('EDIDateComponent', 'time changed', event);
        console.log('date changed to', this.item.value);
    }
}