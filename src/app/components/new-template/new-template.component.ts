import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Element} from '../../model/Element';
import {BaseDatasource} from '../../model/Datasource';
import {EDIML} from '../../model/EDIML';
import {Template} from '../../model/Template';
import {ActivatedRoute} from '@angular/router';
import {CatalogueService} from '../service/catalogue.service';
import {AlternativeGroup} from '../../model/AlternativeGroup';
import {Item} from '../../model/Item';
import {EDITemplate} from '../service/EDITemplate';
import {MetadataService} from '../service/MetadataService';
import {MatDialog} from '@angular/material';
import {LoadingDialogComponent} from '../../pages/loading-dialog/loading-dialog.component';

@Component({
    selector: 'app-new-template',
    templateUrl: './new-template.component.html',
    styleUrls: ['./new-template.component.css']
})
export class NewTemplateComponent implements AfterViewInit {
    templateName: string;
    title: string;
    template: Template;
    loading = true;
    interfaceLanguage = 'en';
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

    /*
      sendMetadata() {
        this.metadataService.sendMetadata();
      }

    */
    constructor(private route: ActivatedRoute, private EDITemplate: EDITemplate, public metadataService: MetadataService, private catalogueService: CatalogueService, public dialog: MatDialog) {

        this.metadataService.state._interfaceLanguage.asObservable().subscribe(
            res => this.interfaceLanguage = res
        );
        this.metadataService.state.queryParameters = this.route.snapshot.queryParams;
        console.log('queryParams', this.route.snapshot.queryParams);

        this.route.params.subscribe(params => {
            this.dialog.open(LoadingDialogComponent, {});
            console.log('params', params);
            this.templateName = params['template'];
            this.template = new Template();
            this.metadataService.state.templateName = this.templateName;
            console.log('State is', this.metadataService.state.templateName);

            console.log('about to load template', 'assets/templates/' + this.templateName);
            /*
                  if ( this.route.snapshot.queryParams['catalogue'] ) {
                    this.EDITemplate.loadFromCatalogue(this.templateName)
                      .subscribe((res) => {
                        this.template = res;
                        this.title = this.metadataService.state.templateName;
                        if ( this.route.snapshot.queryParams['edit'] ) {
                          let id = this.route.snapshot.queryParams['edit'];
                          this.catalogueService.getEDIML(id)
                            .subscribe( res2 => {
                              console.log('loaded EDIML', id, res2);
                              this.metadataService.state.mergeWithEDIML(res2);
                              console.log('merged with EDIML', id, this.metadataService.state.template);
                              this.catalogueService.setId(id);
                              console.log('Loading EDIML', 'CatalogueId', this.catalogueService.getCatalogueMetadatumURL());
                              this.loading = false;
                              console.log('Template loaded: ', res2);
                            })
                        } else {
                          this.loading = false;
                          console.log('Template loaded: ', res);
                        }
                      });
                  } else {
            */
            this.EDITemplate.load('assets/templates/' + this.templateName)
                .subscribe((res) => {
                    this.template = res;
                    this.title = this.metadataService.state.templateName;
                    if (this.route.snapshot.queryParams['edit']) {
                        let id = this.route.snapshot.queryParams['edit'];
                        this.catalogueService.getEDIML(id)
                            .subscribe(res2 => {
                                console.log('loaded EDIML', id, res2);
                                this.metadataService.state.mergeWithEDIML(res2);
                                console.log('merged with EDIML', id, this.metadataService.state.template);
                                console.log('datasources after merge', BaseDatasource.datasources);
                                this.catalogueService.setId(id);
                                console.log('Loading EDIML', 'CatalogueId', this.catalogueService.getCatalogueMetadatumURL());
                                this.loading = false;
                                console.log('Template loaded: ', res2);
                                this.dialog.closeAll();
                            });
                    } else {
                        this.loading = false;
                        console.log('Template loaded: ', res);
                        this.dialog.closeAll();
                    }
                });
            /*
                  }
            */
        });
    }

    ngAfterViewInit() {
        EDIML.metadataService = this.metadataService;
        Item.metadataService = this.metadataService;
        Element.metadataService = this.metadataService;
        BaseDatasource.metadataService = this.metadataService;
    }

    test() {
        BaseDatasource.find('languages.1').refresh();
        console.log('languages', BaseDatasource.find('languages'));
        console.log('languages.1', BaseDatasource.find('languages.1'));
    }


}
