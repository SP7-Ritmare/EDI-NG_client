import {Component, OnInit} from '@angular/core';
import {GenericService} from './components/service/generic.service';
import {Category} from './category';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [GenericService]
})
export class AppComponent {
    title = 'The app works!';
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
}
