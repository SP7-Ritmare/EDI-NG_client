import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {TimePickerValue} from '../time-picker/time-picker.component';
import {EDITemplate} from '../../service/EDITemplate';

@Component({
    selector: 'app-edi-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
    @Input() item: Item;
    time: TimePickerValue = {
        hours: '0',
        minutes: '0',
        seconds: '0',
        timezone: 'CUT'
    };

    constructor(public template: EDITemplate) {
    }

    ngOnInit() {
    }

    private pad(num: string, size: number) {
        var s = "000000000" + parseInt(num);
        return s.substr(s.length - size);
    }

    private toString() {
        if ( this.template && this.template.getTimezone ) {
            return this.pad(this.time.hours, 2) + ':' + this.pad(this.time.minutes, 2) + ':' + this.pad(this.time.seconds, 2) + (this.template.getTimezone(this.time.timezone) ? this.template.getTimezone(this.time.timezone).formattedOffset : '') + 'Z';
        } else {
            return '';
        }
    }


    timeChanged(event: TimePickerValue) {
        this.time = event;
        this.item.value = this.toString();
        console.log('EDITimeComponent', 'time changed', event);
        console.log('date changed to', this.item.value);
    }
}
