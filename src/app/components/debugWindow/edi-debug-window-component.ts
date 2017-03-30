/**
 * Created by fabio on 24/03/2017.
 */

import {Component, OnInit} from '@angular/core';
import {IDatasource, BaseDatasource} from '../../model/Datasource';
import {State} from '../../model/State';
import {ITemplate} from '../../model/Template';
@Component({
    selector: 'debug-window',
    template: `
        <pre>{{template | json}}</pre>
    `
})
export class DebugWindowComponent implements OnInit {
    datasources: BaseDatasource[];
    template: ITemplate;

    constructor() {
    }

    ngOnInit() {
        setTimeout( () => {
            console.log('datasources', BaseDatasource.datasources);
            var stringify = require('json-stringify-safe');
            var json = stringify(BaseDatasource.datasources);
            console.log('pruned', JSON.parse(json));
            this.datasources = JSON.parse(json);
            if ( State.template ) {
                this.template = JSON.parse(stringify(State.template));
            }
        }, 1000);
    }
}