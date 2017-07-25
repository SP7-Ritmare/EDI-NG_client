import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {ConfigService} from './ConfigService';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CatalogueService {
    _defaultEDICatalogue = 'wrong url';
    static currentCatalogueUrl: string = null;

    constructor(private http: Http, private configService: ConfigService) {
        this._defaultEDICatalogue = configService.getConfiguration()['ediCatalogue'];
        console.log('default EDI Catalogue', this._defaultEDICatalogue);
    }

    get catalogueMetadatumURL() {
        console.log('CatalogueService', 'catalogueMetadatumURL');
        return CatalogueService.currentCatalogueUrl;
    }

    getCatalogueMetadatumURL() {
        if (CatalogueService.currentCatalogueUrl != null) {
            console.log('CatalogueService', 'catalogueMetadatumURL', CatalogueService.currentCatalogueUrl);
            return Observable.of(CatalogueService.currentCatalogueUrl);
        }
        return this.http.get(this._defaultEDICatalogue + '/requestId')
            .map(res => res.text())
            .map(res => CatalogueService.currentCatalogueUrl = res)
    }

    sendToCatalogue(metadatum: any) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        this.http
            .post(this._defaultEDICatalogue + '/metadata', metadatum, options)
            .map(res => res.json())
            .subscribe(res => {
                console.log('sent to catalogue', res);
                alert('Your XML has been generated and saved to EDI Catalogue')
            })
    }

    getMetadata() {
        return this.http.get(this._defaultEDICatalogue + '/metadata')
            .map( res => res.json());
    }

    getEDIML(id: string) {
        return this.http.get(this._defaultEDICatalogue + '/metadata/' + id + '.json')
            .map( res => res.json());
    }

}
