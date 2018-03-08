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
import {ConfigService} from './ConfigService';
import {CatalogueService} from './catalogue.service';
import {EDITemplate} from './EDITemplate';
import {Element} from '../../model/Element';
import {Item} from '../../model/Item';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export interface IMetadataServiceStatus {
  preparing: number;
  sending: number;
  storing: number;
};

@Injectable()
export class MetadataService {
  static currentEdimlId: any = null;
    _defaultMetadataEndpoint = 'http://localhost:8080';
    _defaultEDICatalogue = 'wrong url';
/*
    static currentCatalogueUrl: string = null;
*/
    state: State = new State;
    private readonly initialStatus: IMetadataServiceStatus = {
      preparing: -1,
      sending: -1,
      storing: -1
    };

    currentStatus: BehaviorSubject<IMetadataServiceStatus> = new BehaviorSubject<IMetadataServiceStatus>(this.initialStatus);

    constructor(private http: HttpClient, private configService: ConfigService, private catalogueService: CatalogueService) {
        this._defaultEDICatalogue = configService.getConfiguration()['ediCatalogue'];
        console.log('default EDI Catalogue', this._defaultEDICatalogue);
    }

    set defaultMetadataEndpoint(value) {
        this._defaultMetadataEndpoint = value;
    }
    get defaultMetadataEndpoint() {
        return this._defaultMetadataEndpoint;
    }

    /**
     * @deprecated
     *
     * @returns {string}
     */
    generateSensorId() {
        return 'http://edi.get-it.it/sensor/blabla';
    }

    clear() {
        CatalogueService.currentCatalogueUrl = null;
        MetadataService.currentEdimlId = null;
    }

    getEdimlId() {
        if ( MetadataService.currentEdimlId != null ) {
            return Observable.of(MetadataService.currentEdimlId);
        }
        return this.http.get(this._defaultMetadataEndpoint + '/rest/ediml/requestId')
            /*.map( res => res.json() )*/
            .map( res => MetadataService.currentEdimlId = res )
    }

    get catalogueMetadatumURL() {
        return CatalogueService.currentCatalogueUrl;
    }

    getCatalogueMetadatumURL() {
        return this.catalogueService.getCatalogueMetadatumURL();
    }

    sendToCatalogue(metadatum: any) {
        this.catalogueService.sendToCatalogue(metadatum)
          .subscribe( res => {
            let status = this.currentStatus.getValue();
            status.storing = 100;
            this.currentStatus.next(status);
          });
    }

    private saveEDIML(ediml: EDIML) {
        let edimlXml = ediml.toXML();
        console.log('EDIML', edimlXml);
        let headers = new HttpHeaders({'Content-Type': 'application/xml'});
        let options = {headers: headers};

        // this._defaultMetadataEndpoint = 'http://localhost:8080';

        console.log('about to post metadata', ediml);
        this.http.post(this._defaultMetadataEndpoint + '/rest/metadata', edimlXml, options)
/*
            .catch((error: Response | any) => {
                console.error(error.message || error);
                return Observable.throw(error.message || error);
            })
*/
            .subscribe((res: any) => {
                console.log('post metadata results', res);
                this.http
                    .get(this._defaultMetadataEndpoint + '/rest/ediml/' + res['edimlId'] + '.json')
                    .subscribe( result => {
                        res['ediml'] = result;
                        this.sendToCatalogue(res);
                    });
            })
        ;
    }

    prepareEDIML() {
        let template;
        let datasources;

        let status = this.currentStatus.getValue();
        status.preparing = 0;
        this.currentStatus.next(status);

        console.log('datasources', BaseDatasource.datasources);
        let stringify = require('json-stringify-safe');
        let json = stringify(BaseDatasource.datasources);
        console.log('pruned', JSON.parse(json));
        datasources = JSON.parse(json);
        if (this.state.template) {
            template = JSON.parse(stringify(this.state.template));
        }
        console.log('Template', template);
        let ediml = new EDIML(template);
        ediml.contents.templateName = this.state.templateName;
        status.preparing = 100;
        this.currentStatus.next(status);
        return ediml;
    }

    sendMetadata() {
      const ediml = this.prepareEDIML();

      let status = this.currentStatus.getValue();
      status.sending = 0;
      this.currentStatus.next(status);

      if ( !ediml.contents.fileId ) {
            this.getEdimlId()
                .subscribe( res => {
                    console.log('received id', res);
                    ediml.contents.fileId = res.id;
                    ediml.contents.fileUri = res.uri;
                    ediml.contents.starterKit = res.starterKit || 'noSK';
                    console.log('ediml modified', ediml.contents);
                    console.log('Saving EDIML', 'CatalogueId'/*, this.catalogueService.getCatalogueMetadatumURL()*/);
                    status.sending = 100;
                    status.storing = 0;
                    this.currentStatus.next(status);
                    this.catalogueService.getCatalogueMetadatumURL()
                        .subscribe( (url: any) => {
                            console.log('1 received uri', url);
                            ediml.contents.fileUri = url;
                            this.saveEDIML(ediml);
                        });
                });
        } else {
            status.sending = 100;
            status.storing = 0;
            this.currentStatus.next(status);
            this.catalogueService.getCatalogueMetadatumURL()
                .subscribe( res => {
                    console.log('2 received uri', res);
                    ediml.contents.fileUri = res;
                    this.saveEDIML(ediml);
                });
        }

    }
}
