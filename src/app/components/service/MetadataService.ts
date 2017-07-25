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


@Injectable()
export class MetadataService {
    _defaultMetadataEndpoint = 'http://localhost:8080';
    _defaultEDICatalogue = 'wrong url';
    static currentCatalogueUrl: string = null;
    static currentEdimlId: any = null;

    constructor(private http: Http, private configService: ConfigService, private catalogueService: CatalogueService) {
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
        MetadataService.currentCatalogueUrl = null;
        MetadataService.currentEdimlId = null;
    }

    getEdimlId() {
        if ( MetadataService.currentEdimlId != null ) {
            return Observable.of(MetadataService.currentEdimlId);
        }
        return this.http.get(this._defaultMetadataEndpoint + '/rest/ediml/requestId')
            .map( res => res.json() )
            .map( res => MetadataService.currentEdimlId = res )
    }

    get catalogueMetadatumURL() {
        return CatalogueService.currentCatalogueUrl;
    }

    getCatalogueMetadatumURL() {
        return this.catalogueService.getCatalogueMetadatumURL();
    }

    sendToCatalogue(metadatum: any) {
        return this.catalogueService.sendToCatalogue(metadatum);
    }

    private saveEDIML(ediml: EDIML) {
        let edimlXml = ediml.toXML();
        console.log('EDIML', edimlXml);
        let headers = new Headers({'Content-Type': 'application/xml'});
        let options = new RequestOptions({headers: headers});

        // this._defaultMetadataEndpoint = 'http://localhost:8080';

        console.log('about to post metadata', this.http);
        this.http.post(this._defaultMetadataEndpoint + '/rest/metadata', edimlXml, options)
            .map(res => {
                console.log('post metadata results', res.json());
                return res.json();
            })
            .catch((error: Response | any) => {
                console.error(error.message || error);
                return Observable.throw(error.message || error);
            })
            .subscribe(res => {
                console.log('post metadata results', res);
                this.http
                    .get(this._defaultMetadataEndpoint + '/rest/ediml/' + res['edimlId'] + '.json')
                    .map( res => res.json() )
                    .subscribe( result => {
                        res['ediml'] = result;
                        this.catalogueService.sendToCatalogue(res);
                    })
            })
        ;
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
        ediml.contents.templateName = State.templateName;

        if ( !ediml.contents.fileId ) {
            this.getEdimlId()
                .subscribe( res => {
                    console.log('received id', res);
                    ediml.contents.fileId = res.id;
                    ediml.contents.fileUri = res.uri;
                    ediml.contents.starterKit = res.starterKit || 'noSK';
                    console.log('ediml modified', ediml.contents);
                    this.catalogueService.getCatalogueMetadatumURL()
                        .subscribe( res => {
                            ediml.contents.fileUri = res;
                            this.saveEDIML(ediml);
                        })
                })
        } else {
            this.saveEDIML(ediml);
        }

    }
}
