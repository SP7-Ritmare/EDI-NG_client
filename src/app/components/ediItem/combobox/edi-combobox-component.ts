/**
 * Created by fabio on 06/03/2017.
 */

import {Component, Input, Host, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {MainLayoutComponent} from '../../layout/main-layout-component';
import {EdiElementComponent} from '../../ediElement/edi-element-component';
import {EdiItemComponent} from '../edi-item-component';
import {State} from '../../../model/State';
@Component({
    selector: 'app-edi-combobox',
    template: `
        <md-select [(ngModel)]="item.valueObject" (change)="selectRow($event)" placeholder="{{placeholder()}}" [required]="item.mandatory">
            <md-option *ngFor="let v of possibleValues" [value]="v.c">{{v.l}}</md-option>
        </md-select>
`,
    styleUrls: [],
    providers: []
})
export class EdiComboboxComponent extends EdiItemComponent implements OnInit {
    interfaceLanguage: string;
    @Input() item: Item;

    selectRow(value: any) {
        let values = {
            c: this.item.value
        };
        console.log(values);
        this.datasource.setCurrentRow(values);
    }

    placeholder() {
        if (this.item.label) {
            for (let l of this.item.label) {
                if (l['_xml:lang'] === State.interfaceLanguage) {
                    return l['__text'];
                }
            }
        }
        return '';
    }

    ngOnInit() {
        if (this.item) {
            this.datasource = this.item.datasource;
            console.log('init combo on item ', this.item, 'datasource', this.datasource);
            if (this.datasource) {
                this.datasource.results.subscribe(
                    res => {
                        console.log('Item', this.item.id, 'received data', res);
                        this.possibleValues = res;
                    },
                    err => {
                        console.log('Item data fetch error', err);
                    });
                this.datasource.refresh();
            }
        }
    }
}
