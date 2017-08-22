import {Logger, availableContexts} from '../utils/logger';
import {EndpointTypeAdapter} from './EndpointTypeAdapter';
import {Response} from '@angular/http';
import {isNullOrUndefined} from 'util';
import {ITemplateEndpointTypes, ITemplateEndpointType} from './Template';
/**
 * Created by fabio on 06/03/2017.
 */

interface IParameter {
    name: string;
    value: string;
};

export class ContentTypes {
    static sparqlJSON: 'application/sparql-results+json; charset=utf-8, application/json; charset=utf-8';
    static sparqlJSONP: 'application/sparql-results+json; charset=utf-8, application/json; charset=utf-8';
    static JSON: 'application/json';
}

interface IBaseParams {
    id: string;
    method: string;
    queryParameter: string;
    contentType: string;
    parameters: IParameter[];
}

const baseParams: IBaseParams = {
    id: undefined,
    method: 'GET',
    queryParameter: 'query',
    contentType: ContentTypes.sparqlJSON,
    parameters: []
};

export enum HTTPMethod {
    GET,
    POST
}

export interface IEndpointType {
    id: string;
    method: HTTPMethod;
    queryParameter: string;
    parameters: IParameter[];
    contentType: string;
}

export interface IFunction {
    (r: Response): any[];
}

export class EndpointType implements IEndpointType {
    static endpointTypes: EndpointType[] = [];
    static logger = new Logger(availableContexts.ENDPOINTTYPE);
    id: string;
    method: HTTPMethod;
    queryParameter: string;
    parameters: IParameter[];
    contentType: string;
    private _adapter: EndpointTypeAdapter;
    private logger: Logger = new Logger(availableContexts.ENDPOINTTYPE);

    static find(id: string): EndpointType {
        for ( let e of EndpointType.endpointTypes ) {
            if ( e.id === id ) {
                return e;
            }
        }
        return undefined;
    }

/*
    constructor(e: IEndpointType) {
        this.id = e.id;
        this.method = e.method;
        this.queryParameter = e.queryParameter;
        this.parameters = e.parameters;
        EndpointType.endpointTypes.push(this);
    }
*/

    constructor(e: ITemplateEndpointType) {
        this.id = e['_xml:id'];
        this.method = ( e._method === 'GET' ? HTTPMethod.GET : HTTPMethod.POST );
        this.contentType = e.contentType;
        this.queryParameter = e._queryParameter;
        this.parameters = [];
        for ( let p of e.parameters.parameter ) {
            this.parameters.push({
                name: p._name,
                value: p._value
            });
        }
        EndpointType.endpointTypes.push(this);
    }
    get adapter(): IFunction {
        if ( this.contentType === ContentTypes.sparqlJSON || this.contentType === ContentTypes.sparqlJSONP ) {
            return EndpointTypeAdapter.sparqlAdapter;
        }
        if ( this.contentType === ContentTypes.JSON) {
            return EndpointTypeAdapter.jsonAdapter;
        }

        return undefined;
    }


}
