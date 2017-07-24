import {Component, EventEmitter, OnInit, Output} from '@angular/core';

export interface TimePickerValue {
    hours: string;
    minutes: string;
    seconds: string;
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
    currentValue: TimePickerValue = {
        hours: '0',
        minutes: '0',
        seconds: '0'
    }

    constructor() {
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
