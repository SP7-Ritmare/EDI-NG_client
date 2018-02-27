
import {Component, Input} from '@angular/core';
import {IMyDateRangeModel, IMyOptions} from 'mydaterangepicker';
import {Item} from '../../../model/Item';
@Component({
    selector: 'app-edi-date-range',
    template: `
<!--
        <pre>{{item | removeCyclic | json}}</pre>
-->
        <div>
            <div class="startDate">
                <div class="form form-label itemLabel">
                    <div *ngFor="let l of item.start.label">
                        <div *ngIf="l['_xml:lang'] == interfaceLanguage && item.mandatory" class="itemMandatory">{{l.__text}}</div>
                        <div *ngIf="l['_xml:lang'] == interfaceLanguage && !item.mandatory" class="itemNotMandatory">{{l.__text}}</div>
                    </div>
                </div>
            </div>
            <div class="endDate">
                <div class="form form-label itemLabel">
                    <div *ngFor="let l of item.end.label">
                        <div *ngIf="l['_xml:lang'] == interfaceLanguage && item.mandatory" class="itemMandatory">{{l.__text}}</div>
                        <div *ngIf="l['_xml:lang'] == interfaceLanguage && !item.mandatory" class="itemNotMandatory">{{l.__text}}</div>
                    </div>
                </div>
            </div>
            <my-date-range-picker [options]="myDateRangePickerOptions"
                                  (dateRangeChanged)="onDateRangeChanged($event)"></my-date-range-picker>
        </div>
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
        const dates = event.formatted.split(' - ');
        this.item.start.value = dates[0];
        this.item.end.value = dates[1];
        console.log('onDateRangeChanged(): Formatted: ', event.beginDate, event.endDate, this.item);
    }
}
