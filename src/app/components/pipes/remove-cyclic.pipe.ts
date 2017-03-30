

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'removeCyclic'})
export class RemoveCyclicPipe implements PipeTransform {
    transform(value: any): any {
        var stringify = require('json-stringify-safe');
        var json = stringify(value);
        return JSON.parse(json);
    }
}