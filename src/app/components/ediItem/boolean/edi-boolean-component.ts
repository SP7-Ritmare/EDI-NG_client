/**
 * Created by fabio on 24/03/2017.
 */

import {Component, Input} from '@angular/core';
import {Item} from '../../../model/Item';
@Component({
    selector: 'app-edi-boolean',
    template: ` 
         <mat-slide-toggle style="clear: both; float: left;" color="primary" [checked]="item.value == 'true'" (change)="onChange($event)"></mat-slide-toggle>
         <mat-chip-list style="float: left; margin: 13px 0;">
             <mat-chip color="accent">{{item.value | json}}</mat-chip>
         </mat-chip-list>
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
