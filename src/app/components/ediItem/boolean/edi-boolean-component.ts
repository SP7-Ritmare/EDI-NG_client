/**
 * Created by fabio on 24/03/2017.
 */

import {Component, Input} from '@angular/core';
import {Item} from '../../../model/Item';
@Component({
    selector: 'app-edi-boolean',
    template: ` 
         <md-slide-toggle style="clear: both; float: left;" color="primary" [checked]="item.value == 'true'" (change)="onChange($event)"></md-slide-toggle>
         <md-chip-list style="float: left; margin: 13px 0;">
             <md-chip color="accent">{{item.value | json}}</md-chip>
         </md-chip-list>
    `
})
export class EdiBooleanComponent {
    @Input() item: Item;

    onChange(event: any) {
        console.log('onChange', event);
        if ( event.checked ) {
            this.item.value = 'true';
        } else {
            this.item.value = 'false';
        }
    }
}