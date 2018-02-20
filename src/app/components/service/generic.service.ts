import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Category} from '../../category';
import 'rxjs/add/operator/map';
import {Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from "@angular/common/http";

export interface State {
    counter: number;
};

@Injectable()
export class GenericService {
    private baseUrl = 'https://enygma.it/rupesBO/';
    private _categories: Category[];
    private dataStore: {
        categories: Category[]
    };
    private state: State = {
        counter: 1
    };
    public counter: ReplaySubject<State> = new ReplaySubject(1);

    constructor(private http: HttpClient) {
        this.dataStore = {categories: []};
        this._categories = [];
        setInterval( () => {
            this.state.counter++;
            this.counter.next(this.state);
            console.log(this.state);
        }, 1000);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get(this.baseUrl + 'categories')
            .map((res: Response) => res.json())
            ;
    }

    get categories() {
        return this._categories;
    }
}
