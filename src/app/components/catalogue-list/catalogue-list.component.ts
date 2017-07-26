import {Component, OnInit} from '@angular/core';
import {CatalogueService} from '../service/catalogue.service';

@Component({
    selector: 'app-catalogue-list',
    templateUrl: './catalogue-list.component.html',
    styleUrls: ['./catalogue-list.component.css']
})
export class CatalogueListComponent implements OnInit {
    metadata: any[] = [];
    search: any = {
        templateName: ''
    };
    query: string;

    constructor(private catalogueService: CatalogueService) {
/*
        this.catalogueService.getMetadata()
            .subscribe(res => this.metadata = res);
*/
    }

    ngOnInit() {
    }

    onKeyUp() {
        this.catalogueService.search(this.query)
            .subscribe( res => this.metadata = res);
    }
}
