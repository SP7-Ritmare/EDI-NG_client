/**
 * Created by fabio on 06/03/2017.
 */

import {Component, Input, Host, ElementRef, OnInit} from '@angular/core';
import {Item} from '../../../model/Item';
import {MainLayoutComponent} from '../../layout/main-layout-component';
import {EdiElementComponent} from '../../ediElement/edi-element-component';
import {EdiItemComponent} from '../edi-item-component';
import {State} from '../../../model/State';
@Component({
    selector: 'app-edi-textbox',
    template: `
<!--
        <pre *ngIf="item.elementId == 'manufacturer'">{{item | removeCyclic | json}}</pre>
-->
<pre>{{item.id}} {{item.value}}</pre>
        <md-input-container class="col-md-12">
            <input mdInput #pippo="ngModel" type="text" [attr.name]="item.id" placeholder="{{placeholder()}}" [(ngModel)]="item.value" pattern="{{pattern}}" (change)="onChange($event)" [required]="item.mandatory">
        </md-input-container>
        <div class="alert alert-danger" *ngIf="!pippo.valid && pippo.touched && pippo.value.length == 0">Mandatory field</div>
        <div class="alert alert-danger" *ngIf="!pippo.valid && pippo.touched && pippo.value.length > 0">{{errorMessage}}</div>
    `,
    styleUrls: ['./edi-textbox-component.css'],
    providers: []
})
export class EdiTextboxComponent extends EdiItemComponent implements OnInit {
    interfaceLanguage: string;
    pattern: string;
    errorMessage: string;
    @Input() item: Item;

    placeholder() {
        if ( this.item.label ) {
            for ( let l of this.item.label ) {
                if ( l['_xml:lang'] === State.interfaceLanguage ) {
                    return l['__text'];
                }
            }
        }
        return '';
    }
    onChange(event: any) {
        console.log('textbox change', this.item.id, event);
    }
    ngOnInit() {
      if ( !this.item.value ) {
        this.item.value = '';
      }
        if ( this.item && (this.item.dataType === 'real' || this.item.dataType === 'double') ) {
            this.pattern = '^[0-9\.]*$';
            this.errorMessage = this.placeholder() + ' should be a real number';
        }
        if ( this.item && (this.item.dataType === 'int' || this.item.dataType === 'integer') ) {
            this.pattern = '^[0-9\]*$';
            this.errorMessage = this.placeholder() + ' should be an integer';
        }
        if ( this.item && (this.item.dataType === 'URL' || this.item.dataType === 'URI')) {
            let re_js_rfc3986_URI = /^[A-Za-z][A-Za-z0-9+\-.]*:(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?$/;
            let oldEDIRegexString = '^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$';
/*
            var oldEDIRegex = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','iu');
*/
            console.log('RegEx', oldEDIRegexString);
            this.pattern = oldEDIRegexString;
            this.errorMessage = this.placeholder() + ' should be a URI';
        }
    }
}
