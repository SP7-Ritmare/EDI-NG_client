/**
 * Created by fabio on 18/04/2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';


@Injectable()
export class MetadataService {

    constructor(private http: Http) {

    }

    static generateSensorId() {
        return 'http://edi.get-it.it/sensor/blabla';
    }
}