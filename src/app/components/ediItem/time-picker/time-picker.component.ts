import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EDITemplate} from '../../service/EDITemplate';

export interface TimePickerValue {
    hours: string;
    minutes: string;
    seconds: string;
    timezone: string;
}

@Component({
    selector: 'time-picker',
    templateUrl: './time-picker.component.html',
    styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
    @Output() timeChange: EventEmitter<TimePickerValue> = new EventEmitter<TimePickerValue>();

    hours: number[] = [];
    minutes: number[] = [];
    seconds: number[] = [];
    @Input() currentValue: TimePickerValue;

    constructor(public template: EDITemplate) {
        for ( let i = 0; i < 60; i++ ) {
            this.minutes.push(i);
            this.seconds.push(i);
            if ( i < 24 ) {
                this.hours.push(i);
            }
        }
    }

    ngOnInit() {
    }

    selectionChange() {
        this.timeChange.emit(this.currentValue);
    }
}
