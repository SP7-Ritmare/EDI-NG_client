/**
 * Created by fabio on 18/04/2017.
 */
import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {BaseDatasource} from "../../model/Datasource";
import {State} from "../../model/State";
import {EDIML} from "../../model/EDIML";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";


@Injectable()
export class MetadataService {

  constructor(private http: Http) {

  }

  generateSensorId() {
    return 'http://edi.get-it.it/sensor/blabla';
  }

  sendMetadata() {
    let template;
    let datasources;

    console.log('datasources', BaseDatasource.datasources);
    let stringify = require('json-stringify-safe');
    let json = stringify(BaseDatasource.datasources);
    console.log('pruned', JSON.parse(json));
    datasources = JSON.parse(json);
    if (State.template) {
      template = JSON.parse(stringify(State.template));
    }
    console.log('Template', template);
    let ediml = new EDIML(template);
    let edimlXml = ediml.toXML();
    console.log('EDIML', edimlXml);
    let headers = new Headers({'Content-Type': 'application/xml'});
    let options = new RequestOptions({headers: headers});
    this.http.post('http://edidemo.get-it.it/edi/rest/metadata', edimlXml, options)
      .map(res => console.log('post metadata results', res.text()))
      .catch((error: Response | any) => {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
      })
    ;

  }
}
