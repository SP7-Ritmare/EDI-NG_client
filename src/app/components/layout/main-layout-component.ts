/**
 * Created by fabio on 02/03/2017.
 */

import {Component} from '@angular/core';
import {XML2JSON} from '../../utils/XML2JSON';
import {EDITemplate} from '../service/EDITemplate';
import {ITemplate, Template} from '../../model/Template';
import {State} from '../../model/State';

// const templateUrl = '../assets/RNDT_dataset_v4.00.xml';
const templateUrl = 'assets/SensorML20_lightweight_v1.00_forLTER_newSchema.xml';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout-component.html',
    styleUrls: ['./main-layout-component.css'],
    providers: [EDITemplate]
})
export class MainLayoutComponent {

    title: string;
    template: Template;
    interfaceLanguage: string = 'en';

    constructor(private EDITemplate: EDITemplate) {

        this.template = new Template();

        console.log('about to load template', templateUrl);
        this.EDITemplate.load(templateUrl)
            .subscribe( (res) => {
                this.template = res;
                this.title = State.templateName;
                console.log('Template loaded: ', res);
            });
    }
}
