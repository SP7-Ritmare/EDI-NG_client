/**
 * Created by fabio on 24/03/2017.
 */

import {Component, Input} from '@angular/core';
import {Item} from '../../../model/Item';
@Component({
    selector: 'app-edi-boolean',
    template: ` 
        <md-chip>{{item.value}}</md-chip>
        <md-slide-toggle [(ngModel)]="item.value"></md-slide-toggle>
    `
})
export class EdiBooleanComponent {
    @Input() item: Item;

}