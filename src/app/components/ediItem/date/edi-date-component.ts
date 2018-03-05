import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {IMyDateModel, IMyOptions} from 'mydatepicker';
import {TimePickerValue} from '../time-picker/time-picker.component';
import {EDITemplate} from '../../service/EDITemplate';
import * as moment from 'moment';

@Component({
    selector: 'app-edi-date',
    template: `
        <my-date-picker [options]="myDatePickerOptions"
                        (dateChanged)="onDateChanged($event)" [(ngModel)]="date"></my-date-picker>
        <time-picker *ngIf="hasTime" (timeChange)="timeChanged($event)" [currentValue]="time" ngDefaultControl>
            
        </time-picker>
        <pre>{{toString()}}</pre>
    `
})

export class EdiDateComponent implements OnInit {
    /*
        options: DatePickerOptions;
        _date: DateModel;
    */
    @Input() item: Item;
    @Input() hasTime = false;

    time: TimePickerValue = {
        hours: '0',
        minutes: '0',
        seconds: '0',
        timezone: 'CUT'
    };
    date: any = null;

    private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    private pad(num: string, size: number) {
        let s = '000000000' + parseInt(num, 10);
        return s.substr(s.length - size);
    }

    private toString() {
        console.log('this.date', this.date);
        if (this.hasTime) {
            return moment().set(this.date).format('YYYY-MM-DD') +
                'T' + this.pad(this.time.hours, 2) + ':' + this.pad(this.time.minutes, 2) + ':' + this.pad(this.time.seconds, 2) +
                (this.template.getTimezone(this.time.timezone) ? this.template.getTimezone(this.time.timezone).formattedOffset : '') /* + 'Z'*/;
        } else {
            return moment().set(this.date).format('YYYY-MM-DD');
        }
    }

    constructor(public template: EDITemplate) {
    }

    // dateChanged callback function called when the user select the date. This is mandatory callback
    // in this option. There are also optional inputFieldChanged and calendarViewChanged callbacks.
    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
        console.log('onDateChanged', event);
        this.date = event.formatted;
        this.item.value = this.toString();
        console.log('date changed to', this.item.value);
    }

    timeChanged(event: TimePickerValue) {
        console.log('timeChanged', event);
        this.time = event;
        this.item.value = this.toString();
        console.log('EDIDateComponent', 'time changed', event);
        console.log('date changed to', this.item.value);
    }

    ngOnInit() {
        if (this.item.value) {
            console.log('date', this.item.id, this.item.value);
            if ( this.item.value === '$TODAY$' ) {
                this.item.value = moment().format('YYYY-MM-DD');
            }
            this.date = {
                date: {
                    year: moment(this.item.value).year(),
                    month: moment(this.item.value).month() + 1,
                    day: moment(this.item.value).date(),
                }
            };
            this.time = {
                hours: '' + moment(this.item.value).hour(),
                minutes: '' + moment(this.item.value).minute(),
                seconds: '' + moment(this.item.value).second(),
                timezone: 'UTC'
            }
            console.log('date formatted', this.date, this.time);
        } else {
            this.date = {
                date: {
                    year: 0,
                    month: 0,
                    day: 0
                }
            };
            this.date = null;
        }
    }
}