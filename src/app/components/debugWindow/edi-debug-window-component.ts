/**
 * Created by fabio on 24/03/2017.
 */

import {Component, OnInit} from '@angular/core';
import {IDatasource, BaseDatasource} from '../../model/Datasource';
@Component({
    selector: 'debug-window',
    template: `
        <pre>{{datasources | json}}</pre>
    `
})
export class DebugWindowComponent implements OnInit {
    datasources: BaseDatasource[];

    constructor() {
    }

    ngOnInit() {
        setTimeout( () => {
            console.log('datasources', BaseDatasource.datasources);
            var stringify = require('json-stringify-safe');
            var json = stringify(BaseDatasource.datasources);
            console.log('pruned', JSON.parse(json));
            this.datasources = JSON.parse(json);

        }, 1000);
    }
}