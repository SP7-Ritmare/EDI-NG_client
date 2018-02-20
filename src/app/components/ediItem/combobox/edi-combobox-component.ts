/**
 * Created by fabio on 06/03/2017.
 */

import {Component, Input, Host, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {MainLayoutComponent} from '../../layout/main-layout-component';
import {EdiElementComponent} from '../../ediElement/edi-element-component';
import {EdiItemComponent} from '../edi-item-component';
import {State} from '../../../model/State';
import {availableContexts, Logger} from '../../../utils/logger';
import {MetadataService} from '../../service/MetadataService';
@Component({
    selector: 'app-edi-combobox',
    template: `
        <mat-select [(ngModel)]="currentValue" (change)="selectRow($event)"
                   [required]="item.mandatory">
            <mat-option *ngFor="let v of possibleValues" [value]="v.c">{{v.a ? v.a : v.l}}</mat-option>
        </mat-select>
            <pre>{{item.value | removeCyclic | json}}</pre>
            <pre>{{currentValue | removeCyclic | json}}</pre>
    `,
    styleUrls: ['./edi-combobox-component.css']
})
export class EdiComboboxComponent extends EdiItemComponent implements OnInit {
    static logger = new Logger(availableContexts.COMBO);
    interfaceLanguage: string;
    currentValue: string;
    possibleValues: any[] = [];
    @Input() item: Item;

    selectRow(value: any) {
        let values = {
            c: value.value
        };
        this.datasource.setCurrentRow(values);
        EdiComboboxComponent.logger.log('COMBOBOX Component', 'combo select', this.item.id, value, this.datasource.currentRow);
        if (this.datasource.currentRow) {
            EdiComboboxComponent.logger.log('COMBOBOX Component', 'current row', values, this.datasource.currentRow);
            this.item.value = this.datasource.currentRow;
            EdiComboboxComponent.logger.log('new value object', this.item.value);
            this.item.labelValue = (this.item.value.a ? this.item.value.a : this.item.value.l);
            this.item.codeValue = this.item.value.c;
            this.item.urnValue = this.datasource.currentRow.urn;
            this.item.languageNeutral = this.datasource.currentRow.z;
            this.currentValue = this.item.codeValue;
            EdiComboboxComponent.logger.log('COMBOBOX Component', 'new value', this.item.id, this.currentValue);
        } else {
            EdiComboboxComponent.logger.log('COMBOBOX Component', 'no current row on combo');
        }
    }

    placeholder() {
        if (this.item.label) {
            for (let l of this.item.label) {
                if (l['_xml:lang'] === this.metadataService.state.interfaceLanguage) {
                    return l['__text'];
                }
            }
        }
        return '';
    }

    ngAfterViewInit() {
        if (this.item) {
            this.datasource = this.item.datasource;
            EdiComboboxComponent.logger.log('COMBOBOX Component', 'init combo on item ', this.item, 'datasource', this.datasource);

            if (this.datasource) {
                this.datasource.results.subscribe(
                    res => {
                        EdiComboboxComponent.logger.log('COMBOBOX Component', 'Item', this.item.id, this.item.codeValue, 'received data', res);
                        this.possibleValues = res;
                        if (res.length > 0 && this.item.codeValue && this.item.codeValue !== '' && !this.currentValue) {
                            this.currentValue = this.item.codeValue;
                            this.selectRow({
                                value: this.currentValue
                            });
                        }
                        /*
                         if ( res.length > 0 && this.currentValue ) {
                         EdiComboboxComponent.logger.log('COMBOBOX Component', 'selecting row', res, this.item, this.currentValue);
                         this.selectRow({
                         value: this.currentValue
                         });
                         } else {
                         EdiComboboxComponent.logger.log('COMBOBOX Component', 'not selecting row', res, this.item, this.currentValue);
                         }
                         */
                    },
                    err => {
                        EdiComboboxComponent.logger.log('COMBOBOX Component', 'Item data fetch error ' + this.item.id, err);
                    });
                this.datasource.refresh();
            }
        }
    }
}
