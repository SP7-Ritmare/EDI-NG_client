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
    <md-select [(ngModel)]="currentValue" (change)="selectRow($event)" 
            [required]="item.mandatory">
      <md-option *ngFor="let v of possibleValues" [value]="v.c">{{v.a ? v.a : v.l}}</md-option>
    </md-select>
<!--
    <pre>{{item.value | removeCyclic | json}}</pre>
    <pre>{{item.labelValue | removeCyclic | json}}</pre>
-->
  `,
  styleUrls: ['./edi-combobox-component.css']
})
export class EdiComboboxComponent extends EdiItemComponent implements OnInit {
  interfaceLanguage: string;
  currentValue: string;
  possibleValues: any[] = [];
  @Input() item: Item;

  selectRow(value: any) {
    let values = {
      c: value.value
    };
    console.log('combo select', value);
    this.datasource.setCurrentRow(values);
    if (this.datasource.currentRow) {
      this.item.value = this.datasource.currentRow;
      console.log('new value object', this.item.value);
      this.item.labelValue = (this.item.value.a ? this.item.value.a : this.item.value.l);
      this.item.codeValue = this.item.value.c;
      this.item.urnValue = this.datasource.currentRow.urn;
      this.item.languageNeutral = this.datasource.currentRow.z;
      this.currentValue = this.item.codeValue;
    } else {
      console.log('no current row on combo');
    }
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
