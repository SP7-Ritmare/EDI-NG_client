import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EDITemplate} from '../service/EDITemplate';
import {MetadataService} from '../service/MetadataService';
import {CatalogueService} from '../service/catalogue.service';
import {Template} from '../../model/Template';
import {AlternativeGroup} from '../../model/AlternativeGroup';
import {EDIML} from '../../model/EDIML';
import {Item} from '../../model/Item';
import {Element} from '../../model/Element';
import {BaseDatasource} from '../../model/Datasource';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements AfterViewInit {
    templateName: string;
    title: string;
    template: Template;
    loading: boolean = true;
    interfaceLanguage: string = 'en';
    showDebug = false;

    setLanguage(lang: string) {
        this.metadataService.state.interfaceLanguage = lang;
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
        this.metadataService.state._interfaceLanguage.asObservable().subscribe(
            res => this.interfaceLanguage = res
        );
        this.metadataService.state.queryParameters = this.route.snapshot.queryParams;
        console.log('queryParams', this.route.snapshot.queryParams);

        this.route.params.subscribe(params => {
            console.log('params', params)
            this.templateName = params['template'];
            this.template = new Template();
            this.metadataService.state.templateName = this.templateName;
            console.log('State is', this.metadataService.state.templateName);

            console.log('about to load template', 'assets/templates/' + this.templateName);
            if ( this.route.snapshot.queryParams['catalogue'] ) {
                this.EDITemplate.loadFromCatalogue(this.templateName)
                    .subscribe((res) => {
                        this.template = res;
                        this.title = this.metadataService.state.templateName;
                        if ( this.route.snapshot.queryParams['edit'] ) {
                            let id = this.route.snapshot.queryParams['edit'];
                            this.catalogueService.getEDIML(id)
                                .subscribe( res => {
                                    console.log('loaded EDIML', id, res);
                                    this.metadataService.state.mergeWithEDIML(res);
                                    console.log('merged with EDIML', id, this.metadataService.state.template);
                                    this.catalogueService.setId(id);
                                    console.log('Loading EDIML', 'CatalogueId', this.catalogueService.getCatalogueMetadatumURL());
                                    this.loading = false;
                                    console.log('Template loaded: ', res);
                                })
                        } else {
                            this.loading = false;
                            console.log('Template loaded: ', res);
                        }
                    });
            } else {
                this.EDITemplate.load('assets/templates/' + this.templateName)
                    .subscribe((res) => {
                        this.template = res;
                        this.title = this.metadataService.state.templateName;
                        if ( this.route.snapshot.queryParams['edit'] ) {
                            let id = this.route.snapshot.queryParams['edit'];
                            this.catalogueService.getEDIML(id)
                                .subscribe( res => {
                                    console.log('loaded EDIML', id, res);
                                    this.metadataService.state.mergeWithEDIML(res);
                                    console.log('merged with EDIML', id, this.metadataService.state.template);
                                    this.catalogueService.setId(id);
                                    console.log('Loading EDIML', 'CatalogueId', this.catalogueService.getCatalogueMetadatumURL());
                                    this.loading = false;
                                    console.log('Template loaded: ', res);
                                })
                        } else {
                            this.loading = false;
                            console.log('Template loaded: ', res);
                        }
                    });
            }
        });
    }
    ngAfterViewInit() {
        EDIML.metadataService = this.metadataService;
        Item.metadataService = this.metadataService;
        Element.metadataService = this.metadataService;
        BaseDatasource.metadataService = this.metadataService;
    }

}
