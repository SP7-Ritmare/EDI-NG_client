/**
 * Created by fabio on 06/03/2017.
 */

import {Component, Input, Host, OnInit, ElementRef} from '@angular/core';
import {Item} from '../../model/Item';
import {MainLayoutComponent} from '../layout/main-layout-component';
import {EdiElementComponent} from '../ediElement/edi-element-component';
import {State} from '../../model/State';
import {CodelistDatasource, SPARQLDatasource, SingletonDatasource, BaseDatasource} from '../../model/Datasource';
@Component({
    selector: 'app-edi-item',
    templateUrl: './edi-item-component.html',
    styleUrls: ['./edi-item-component.css'],
    providers: []
})
export class EdiItemComponent implements OnInit {
    interfaceLanguage: string;
    datasource: BaseDatasource;
    possibleValues: any[];
    @Input() item: Item;

    constructor() {
    }
    ngOnInit() {
        State._interfaceLanguage.asObservable().subscribe(
            res => this.interfaceLanguage = res
        );
        console.log('init text box', this.item.id, this.item.datasource, this.item.dataType);
        if (this.item.datasource && this.item.dataType === 'select') {
            // this.item.datasource.refresh();
            this.item.datasource._currentRow.subscribe(
                res => {
                    console.log('ds timeChange on item', this.item.id, res, this.item);
                    this.item.value = res[this.item.field];
                },
                err => {
                    console.log('ds timeChange error', err);
                },
                () => {
                    console.log('ds timeChange complete');
                }
            )
        }
    }
}
