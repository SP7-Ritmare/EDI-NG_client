/**
 * Created by fabio on 02/03/2017.
 */

import {Component, ViewEncapsulation} from '@angular/core';
import {XML2JSON} from '../../utils/XML2JSON';
import {EDITemplate} from '../service/EDITemplate';
import {ITemplate, Template} from '../../model/Template';
import {State} from '../../model/State';
import {AlternativeGroup} from '../../model/AlternativeGroup';
import {MetadataService} from "../service/MetadataService";
import {ActivatedRoute} from '@angular/router';
import {CatalogueService} from '../service/catalogue.service';

// const templateUrl = '../assets/RNDT_dataset_v4.00.xml';
// const templateUrl = 'assets/SensorML20_lightweight_v1.00_forLTER_newSchema.xml';
const templateUrl = 'assets/RNDT_dataset_v4.00_newFormat.xml';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout-component.html',
    styleUrls: ['./main-layout-component.scss'],
    providers: [EDITemplate],
    encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent {
    templateName: string;
    title: string;
    template: Template;
    loading: boolean = true;
    interfaceLanguage: string = 'en';
    showDebug = false;

    setLanguage(lang: string) {
        State.interfaceLanguage = lang;
    }

    isAlternativeGroup(e: any) {
        if (e instanceof AlternativeGroup) {
            return true;
        } else {
            return false;
        }
    }

    goTo(location: string): void {
        window.location.hash = location;
    }

    sendMetadata() {
        this.metadataService.sendMetadata();
    }

    constructor(private route: ActivatedRoute, private EDITemplate: EDITemplate, public metadataService: MetadataService, private catalogueService: CatalogueService) {
        State._interfaceLanguage.asObservable().subscribe(
            res => this.interfaceLanguage = res
        );
        State.queryParameters = this.route.snapshot.queryParams;
        console.log('queryParams', this.route.snapshot.queryParams);

        this.route.params.subscribe(params => {
            console.log('params', params)
            this.templateName = params['template'];
            this.template = new Template();
            State.templateName = this.templateName;
            console.log('State is', State.templateName);

            console.log('about to load template', templateUrl);
            this.EDITemplate.load('assets/templates/' + this.templateName)
                .subscribe((res) => {
                    this.template = res;
                    this.title = State.templateName;
                    if ( this.route.snapshot.queryParams['edit'] ) {
                        let id = this.route.snapshot.queryParams['edit'];
                        this.catalogueService.getEDIML(id)
                            .subscribe( res => {
                                console.log('loaded EDIML', id, res);
                                State.mergeWithEDIML(res);
                                console.log('merged with EDIML', id, State.template);
                                this.loading = false;
                                console.log('Template loaded: ', res);
                            })
                    } else {
                        this.loading = false;
                        console.log('Template loaded: ', res);
                    }
                });
        });
    }
}
