/**
 * Created by fabio on 17/07/2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Configuration} from './config-model';
@Injectable()

export class ConfigService {
    private config: Configuration;

    constructor(private http: Http) {
    }

    load(url: string) {
        return new Promise((resolve) => {
            this.http.get(url).map(res => res.json())
                .subscribe(config => {
                    this.config = config;
                    resolve();
                });
        });
    }

    getConfiguration(): Configuration {
        return this.config;
    }
}