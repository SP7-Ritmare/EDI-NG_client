/**
 * Created by fabio on 02/03/2017.
 */

import {Component, Input} from '@angular/core';
import {XML2JSON} from '../../utils/XML2JSON';
import {State} from '../../model/State';

// const templateUrl = '../assets/RNDT_dataset_v4.00.xml';
// const templateUrl = 'assets/SensorML20_lightweight_v1.00_forLTER_newSchema.xml';

@Component({
    selector: 'edi-sidebar',
    templateUrl: './edi-sidebar-component.html',
    styleUrls: ['./edi-sidebar-component.css'],
    providers: []
})
export class SidebarComponent {
    title: string;
    @Input() template: any;
    interfaceLanguage = 'en';

    constructor() {
        // this.template = State.template;

        // console.log('about to load template', templateUrl);
    }
}
