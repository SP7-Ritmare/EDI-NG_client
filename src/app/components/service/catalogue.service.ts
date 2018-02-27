import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {ConfigService} from './ConfigService';
import {Observable} from 'rxjs/Observable';
import {availableContexts, Logger} from '../../utils/logger';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CatalogueService {
    static logger = new Logger(availableContexts.CATALOGUE);
    static currentCatalogueUrl: string = null;
    _defaultEDICatalogue = 'wrong url';

    constructor(private http: HttpClient, private configService: ConfigService) {
        this._defaultEDICatalogue = configService.getConfiguration()['ediCatalogue'];
        CatalogueService.logger.log('default EDI Catalogue', this._defaultEDICatalogue);
    }

    get catalogueMetadatumURL() {
        CatalogueService.logger.log('CatalogueService', 'catalogueMetadatumURL');
        return CatalogueService.currentCatalogueUrl;
    }

    setId(id: string) {
        CatalogueService.currentCatalogueUrl = this._defaultEDICatalogue + '/metadata/' + id;
    }

    getCatalogueMetadatumURL() {
        let result = new Subject<string>();
        if (CatalogueService.currentCatalogueUrl) {
            CatalogueService.logger.log('CatalogueService', 'catalogueMetadatumURL', CatalogueService.currentCatalogueUrl);
            setTimeout( () => {
                result.next(CatalogueService.currentCatalogueUrl);
            }, 100);
            // result.complete();
            // return Observable.from(CatalogueService.currentCatalogueUrl);
        } else {
            this.http.get(this._defaultEDICatalogue + '/requestId', {responseType: 'text'})
            /*
                        .map(res => res.text())
            */
                .subscribe(res => {
                    CatalogueService.currentCatalogueUrl = res;
                    result.next(res);
                    // result.complete();
                });
        }
        return result;
    }

    sendToCatalogue(metadatum: any) {
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        let options = {headers: headers};
        console.log('sending to catalogue', metadatum);
        return this.http
            .post(this._defaultEDICatalogue + '/metadata', metadatum, options);
        /*.map(res => res.json())*/
    }

    search(query: string) {
        return this.http.get(this._defaultEDICatalogue + '/discover/' + query)
        /*.map(res => res.json())*/
            .map(res => {
                CatalogueService.logger.log(res);
                return res;
            });
    }

    getMetadata() {
        return this.http.get(this._defaultEDICatalogue + '/metadata');
        /*.map( res => res.json());*/
    }

    getEDIML(id: string) {
        return this.http.get(this._defaultEDICatalogue + '/metadata/' + id + '.json');
        /*.map( res => res.json());*/
    }

    /** TODO: implement */
    saveTemplate(template: any) {
        /*
                CatalogueService.logger.log('saving template', template);
                let headers = {'Content-Type': 'application/json'};
                let options = { headers: new HttpHeaders(headers)};
                this.http
                    .post(this._defaultEDICatalogue + '/templates', template, options)
                    /!*.map(res => res.json())*!/
                    .subscribe((res: any) => {
                        CatalogueService.logger.log('Template sent to catalogue', res);
                        // alert('Your XML has been generated and saved to EDI Catalogue')
                    });
        */
    }

    getTemplates() {
        return this.http.get(this._defaultEDICatalogue + '/templates');
        /*.map( res => res.json());*/
    }

    getTemplate(id: string) {
        return this.http.get(this._defaultEDICatalogue + '/templates/' + encodeURIComponent(id));
        /*.map( res => res.json());*/
    }

}
