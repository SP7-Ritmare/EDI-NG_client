import {Component, OnInit} from '@angular/core';
import {GenericService} from './components/service/generic.service';
import {Category} from './category';
import {BehaviorSubject, Observable} from 'rxjs';
import {Meta, Title} from '@angular/platform-browser';
import {ConfigService} from './components/service/ConfigService';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [GenericService]
})
export class AppComponent {
/*    categories: Observable<Category[]>;

    constructor(private genericService: GenericService) {
        this.categories = genericService.categories;
    }

    getCategories() {
        this.genericService.getCategories();
    }
    ngOnInit(): any {
        this.getCategories();
    }*/
    constructor(private meta: Meta, private title: Title, private config: ConfigService) {
        this.title.setTitle('EDI-NG Client v' + config.getConfiguration()['version']);

    }
}
