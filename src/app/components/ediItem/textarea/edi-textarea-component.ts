/**
 * Created by fabio on 06/03/2017.
 */

import {Component, Input, Host, ElementRef, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {MainLayoutComponent} from '../../layout/main-layout-component';
import {EdiElementComponent} from '../../ediElement/edi-element-component';
import {EdiItemComponent} from '../edi-item-component';
import {State} from '../../../model/State';
import {MetadataService} from '../../service/MetadataService';
@Component({
    selector: 'app-edi-textarea',
    template: `
        <!--<pre>{{item | json}}</pre>-->
        <md-input-container class="col-md-12">
            <textarea mdInput #pippo="ngModel" [attr.name]="item.id" placeholder="{{placeholder()}}" [(ngModel)]="item.value" pattern="{{pattern}}" [required]="item.mandatory"></textarea>
        </md-input-container>
        <!--<div class="alert alert-danger" *ngIf="!pippo.valid && pippo.touched">Mandatory field</div>-->
    `,
    styleUrls: ['./edi-textarea-component.css'],
    providers: []
})
export class EdiTextareaComponent extends EdiItemComponent implements OnInit {
    interfaceLanguage: string;
    pattern: string;
    @Input() item: Item;

    placeholder() {
        if ( this.item.label ) {
            for ( let l of this.item.label ) {
                if ( l['_xml:lang'] === this.metadataService.state.interfaceLanguage ) {
                    return l['__text'];
                }
            }
        }
        return '';
    }

    ngOnInit() {
        if ( this.item && this.item.dataType === 'real' ) {
            this.pattern = '^[0-9\.]*$';
        }
    }
}
