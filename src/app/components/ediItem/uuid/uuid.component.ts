import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {EdiItemComponent} from '../edi-item-component';
import {UUID} from 'angular2-uuid';

@Component({
    selector: 'app-edi-uuid',
    template: `
        <!--<pre>{{item | json}}</pre>-->
        <div class="col-md-12">
            {{item.value}}
        </div>
    `,
    styleUrls: ['./uuid.component.css']
})
export class UuidComponent extends EdiItemComponent implements OnInit {
    interfaceLanguage: string;
    pattern: string;
    errorMessage: string;
    @Input() item: Item;

    ngOnInit() {
        if (!this.item.value) {
            this.item.value = UUID.UUID();
        }
    }

}
