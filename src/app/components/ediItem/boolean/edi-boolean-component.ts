/**
 * Created by fabio on 24/03/2017.
 */

import {Component, Input} from '@angular/core';
import {Item} from '../../../model/Item';
@Component({
    selector: 'app-edi-boolean',
    template: ` 
         <md-slide-toggle style="clear: both; float: left;" color="primary" [(ngModel)]="item.value"></md-slide-toggle>
         <md-chip-list style="float: left; margin: 13px 0;">
             <md-chip color="accent">{{item.value}}</md-chip>
         </md-chip-list>
    `
})
export class EdiBooleanComponent {
    @Input() item: Item;

}