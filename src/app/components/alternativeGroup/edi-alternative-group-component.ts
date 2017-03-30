/**
 * Created by fabio on 28/03/2017.
 */

import {Component, Input} from '@angular/core';
import {AlternativeGroup} from '../../model/AlternativeGroup';
import {Element} from '../../model/Element';
import {State} from '../../model/State';
@Component({
    selector: 'edi-alternative-group',
    template: `
        <!--<pre>{{ group | removeCyclic | json }}</pre>-->
        <h3>Active element: {{group.activeElement}}</h3>
        <md-tab-group (selectChange)="onTabSelected($event)">
                <md-tab *ngFor="let e of group.elements" label="{{placeholder(e)}}">
                    <app-edi-element [element]="e"></app-edi-element>
                </md-tab>
        </md-tab-group>
    `
})
export class EdiAlternativeGroupComponent {
    @Input() group: AlternativeGroup;

    onTabSelected(event: any) {
        console.log('onTabSelected', event);
        this.group.activateElement(event.index);
    }

    placeholder(e: Element) {
        if ( e.label ) {
            for ( let l of e.label ) {
                if ( l['_xml:lang'] === State.interfaceLanguage ) {
                    return l['__text'];
                }
            }
        }
        return ' - ';
    }
}