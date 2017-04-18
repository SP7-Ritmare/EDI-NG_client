/**
 * Created by fabio on 18/04/2017.
 */
import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';

@Component({
    selector: 'app-edi-qrcode',
    template: `
        <div>
            <input type="text" [(ngModel)]="item.value">
            <qr-code [value]="item.value" [size]="150"></qr-code>
        </div>
    `
})
export class EdiQRCodeComponent implements OnInit {
    @Input() item: Item;

    ngOnInit() {

    }
}