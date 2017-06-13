/**
 * Created by fabio on 24/03/2017.
 */

import {Component, OnInit} from '@angular/core';
import {IDatasource, BaseDatasource} from '../../model/Datasource';
import {State} from '../../model/State';
import {ITemplate} from '../../model/Template';
import {EDIML, IEDIMLItem} from "../../model/EDIML";
import {EDITemplate} from '../service/EDITemplate';

@Component({
  selector: 'debug-window',
  template: `
    <textarea>{{edimlXml}}</textarea>
    <pre>{{ediml | removeCyclic | json}}</pre>
  `
})
export class DebugWindowComponent implements OnInit {
  datasources: BaseDatasource[];
  template: ITemplate;
  ediml: EDIML;
  edimlXml: string;

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      console.log('datasources', BaseDatasource.datasources);
      let stringify = require('json-stringify-safe');
      let json = stringify(BaseDatasource.datasources);
      console.log('pruned', JSON.parse(json));
      this.datasources = JSON.parse(json);
      if (State.template) {
        this.template = JSON.parse(stringify(State.template));
      }
      console.log('Template', this.template);
      this.ediml = new EDIML(this.template);
      this.edimlXml = this.ediml.toXML();
      console.log('EDIML', this.ediml, this.edimlXml);
    }, 1000);
  }
}
