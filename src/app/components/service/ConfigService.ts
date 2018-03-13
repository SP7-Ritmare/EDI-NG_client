/**
 * Created by fabio on 17/07/2017.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Configuration} from "../../model/Configuration";
@Injectable()

export class ConfigService {
    private config: Configuration;

    constructor(private http: HttpClient) {
    }

    load(url: string) {
        return new Promise((resolve) => {
            this.http.get(url)
                .subscribe(config => {
                    this.config = <Configuration>config;
                    resolve();
                });
        });
    }

    getConfiguration(): Configuration {
        return this.config;
    }

}
