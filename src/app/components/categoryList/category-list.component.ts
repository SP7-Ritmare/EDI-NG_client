import {Component, OnInit} from '@angular/core';
import {GenericService, State} from '../service/generic.service';
import {Category} from '../../category';

/**
 * Created by fabio on 17/02/2017.
 */
@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css'],
    providers: [GenericService]
})
export class CategoryListComponent implements OnInit {
    title = 'The app works!';
    categories: Category[];
    counter: State = {
        counter: 0
    };

    constructor(private genericService: GenericService) {
        this.categories = genericService.categories;

    }

    getCategories() {
        this.genericService.getCategories().subscribe(
            data => this.categories = data
        );
    }
    ngOnInit(): any {
        this.getCategories();
        this.genericService.counter.subscribe(
            data => {
                this.counter = data;
                console.log('Subscribe', this.counter);
            }
        );
    }
}
