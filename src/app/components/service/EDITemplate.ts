/**
 * Created by fabio on 02/03/2017.
 */

import {Injectable} from '@angular/core';
import {
    IDatasource, CodelistDatasource, BaseDatasource, SingletonDatasource,
    SPARQLDatasource
} from '../../model/Datasource';
import {Http, Headers} from '@angular/http';
import {XML2JSON} from '../../utils/XML2JSON';
import {Observable} from 'rxjs';
import {isArray} from 'util';
import {ITemplate} from '../../model/Template';
import {State} from '../../model/State';
import {Element} from '../../model/Element';
import {EndpointType, ContentTypes, HTTPMethod, IEndpointType} from '../../model/EndpointType';
import {Endpoint} from '../../model/Endpoint';
import {Logger, availableContexts} from '../../utils/logger';
import {AlternativeGroup} from '../../model/AlternativeGroup';

@Injectable()
export class EDITemplate {
    path: string;
    x2js: XML2JSON = new XML2JSON();
    contents: ITemplate;
    private logger: Logger = new Logger(availableContexts.EDI_TEMPLATE_SERVICE);

    constructor(private http: Http) {

    }

    private importEndpointTypes() {
        console.log('importEndpointTypes', this.contents.endpointTypes);
        for ( let et of this.contents.endpointTypes.endpointType ) {
            console.log(et);
            let endpointType: EndpointType = new EndpointType(et);
        }
    }

    private importDatasources() {
        let defaultMetadataEndpoint = this.contents.settings.metadataEndpoint;

        console.log('importDatasources', this.contents.datasources);
        for ( let ds of this.contents.datasources.codelist ) {
            let d = new CodelistDatasource();
            d.fromTemplate(ds);
        }
        console.log('imported codelists', BaseDatasource.datasources);
        for ( let ds of this.contents.datasources.sparql ) {
            let d = new SPARQLDatasource();
            d.fromTemplate(ds);
        }
        for ( let ds of this.contents.datasources.singleton ) {
            let d = new SingletonDatasource();
            d.fromTemplate(ds);
        }
        console.log('imported datasources', BaseDatasource.datasources);
/*
        for ( let dsType in this.contents.datasources ) {
            if ( this.contents.datasources.hasOwnProperty(dsType) ) {
                console.log('importDatasource dsType', dsType);
                for ( let ds of (this.contents.datasources as any)[dsType] ) {
                    console.log('importDatasource ds', ds);
                }
            }
        }
*/
    }

    private fixDatasources() {
        for ( let ds of BaseDatasource.datasources ) {
            if ( ds instanceof SingletonDatasource ) {
                (ds as SingletonDatasource).fixTriggerItem();
            }
        }
    }

    private fixArrays() {
        let object: any = this.contents;
        console.log('fixArrays', this.contents);
        if (!isArray(object.group)) {
            object.group = [object.group];
        }
        if (!isArray(object.endpointTypes.endpointType)) {
            object.endpointTypes.endpointType = [object.endpointTypes.endpointType];
        }
        if (!isArray(object.datasources)) {
//            object.datasources = [object.datasources];
            console.log('object.datasources', object.datasources);
            // let temp: any[] = [];
            for ( let ds in object.datasources ) {
                if ( object.datasources.hasOwnProperty(ds) ) {
                    console.log('fixDatasources', ds, object.datasources[ds]);
                    if ( !isArray(object.datasources[ds]) ) {
                        // temp.push([object.datasources[ds]]);
                        object.datasources[ds] = [object.datasources[ds]];
                    } else {
                        // temp.push(object.datasources[ds]);
                    }
                }
            }
            // object.datasources = temp;
            console.log('object.datasources out', object.datasources);
        }

        for (let g of object.group) {
            if (!isArray(g.element)) {
                g.element = [g.element];
            }
            for (let e of g.element) {
                if (!isArray(e.produces.item)) {
                    e.produces.item = [e.produces.item];
                }
                for (let i of e.produces.item) {
                    i.id = e.id + '_' + i.hasIndex;
                }
            }
        }
        return object;
    }

    private fixBooleans() {
        let object: any = Object.assign({}, this.contents);
        object.settings.requiresValidation = (object.requiresValidation === 'true');
        return object;
    }

    private fixGroupsElementsAndItems() {
        let object: any = Object.assign({}, this.contents);
        let alternativeGroups = {

        };

        console.log('fixGroupsElementsAndItems', object);
        for (let g of object.group) {
            console.log('group', g);
            let elements: (Element|AlternativeGroup)[] = [];
            let doingAlternativeGroup = false;
            let currentAlternativeGroup: AlternativeGroup = new AlternativeGroup();
            for (let e of g.element) {
                console.log('element', e);

                let temp: Element = new Element();
                temp.fromTemplateElement(e);
                console.log('created element', temp);
                if ( !doingAlternativeGroup && e['_alternativeTo'] ) {
                    doingAlternativeGroup = true;
                    currentAlternativeGroup = new AlternativeGroup();
                    currentAlternativeGroup.id = e['_alternativeGroup'];
                    currentAlternativeGroup.elements = [];
                }
                if ( doingAlternativeGroup && !e['_alternativeTo'] ) {
                    doingAlternativeGroup = false;
                    elements.push(currentAlternativeGroup);
                }
                if ( doingAlternativeGroup ) {
                    currentAlternativeGroup.elements.push(temp);
                } else {
                    elements.push(temp);
                }
            }
            g.element = elements;
        }
        return object;
    }

    private inferVersion() {
        if (this.contents.settings.userInterfaceLanguage) {
            State.templateVersion = 2;
        } else {
            State.templateVersion = 1;
        }
    }

    private toEDIML() {

    }

    load(filename: string): Observable<any> {
        this.path = filename;
        State.templateName = filename;
        let headers = new Headers();
        headers.append('Accept', 'application/xml');
        Endpoint.http = this.http;

        return this.http.get(filename, {
            headers: headers
        })
            .map(res => {
                State.originalTemplate = res.text();
                this.contents = this.x2js.xml2json(res.text()).template;
                this.inferVersion();
                console.log('template version is ' + State.templateVersion);
                this.contents = this.fixArrays();
                this.contents = this.fixBooleans();

                State.template = this.contents;

                this.importEndpointTypes();
                this.importDatasources();

                this.contents = this.fixGroupsElementsAndItems();

                console.log(1111111);
                this.fixDatasources();
                console.log(2222222);

                State.interfaceLanguage = this.contents.settings.userInterfaceLanguage['_xml:lang'];
                console.log('Contents: ', this.contents);
                return this.contents;
            })
            ;
    }
}
