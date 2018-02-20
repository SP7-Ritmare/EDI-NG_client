import {Component, OnInit} from '@angular/core';
import {CatalogueService} from '../service/catalogue.service';

@Component({
    selector: 'app-catalogue-list',
    templateUrl: './catalogue-list.component.html',
    styleUrls: ['./catalogue-list.component.css']
})
export class CatalogueListComponent implements OnInit {
    metadata: any[] = [];
    templates: any[] = [];
    search: any = {
        templateName: ''
    };
    query: string;
    templatesQuery: string;

    constructor(private catalogueService: CatalogueService) {
/*
        this.catalogueService.getMetadata()
            .subscribe(res => this.metadata = res);
*/
    }

    ngOnInit() {
        this.getTemplates();
    }

    onKeyUp() {
        this.catalogueService.search(this.query)
            .subscribe( (res: any) => this.metadata = res);
    }

    getTemplates() {
        this.catalogueService.getTemplates()
            .subscribe( (res: any) => {
                console.log('receiving templates', res);
                this.templates = res;
            });
    }

    encodeURIComponent(s: any) {
        return encodeURIComponent(s);
    }
}
