import {Element} from './Element';
import {AlternativeGroup} from './AlternativeGroup';
/**
 * Created by fabio on 05/03/2017.
 */
export interface ITemplateEndpointType {
    '_xml:id': string;
    _method: string;
    _queryParameter: string;
    parameters: {
        parameter: {
            _name: string,
            _value: string
        }[]
    };
    contentType: string;
}

export interface ITemplateEndpointTypes {
    endpointType: ITemplateEndpointType[];
}

export interface ITemplateDatasource {
    '_xml:id': string;
    _endpointType: string;
    url: string;
}


export interface ITemplateCodelist extends ITemplateDatasource {
    uri: string;
}

export interface ITemplateSPARQL extends ITemplateDatasource {
    query: string;
}

export interface ITemplateSingleton extends ITemplateSPARQL, ITemplateDatasource {
    _triggerItem: string;
}

export interface ITemplateDatasources {
    codelist?: ITemplateCodelist[];
    sparql?: ITemplateSPARQL[];
    singleton?: ITemplateSingleton[];
}

export interface ITemplateGroup {
    element: [Element|AlternativeGroup]
}

export interface ITemplateSettings {
    userInterfaceLanguage: {
        '_xml:lang': string
    };
    metadataEndpoint: string;
    sparqlEndpoint: string;
    requiresValidation: boolean;
    baseDocument: string;
    xsltChain: [{
        xslt: string
    }];
}
export interface ITemplate {
    settings: ITemplateSettings;
    endpointTypes: ITemplateEndpointTypes;
    datasources: ITemplateDatasources;
    group: [ITemplateGroup];
}

export class Template implements ITemplate {
    settings: ITemplateSettings;
    endpointTypes: ITemplateEndpointTypes;
    datasources: [ITemplateDatasources];
    group: [ITemplateGroup];

    constructor() {
        this.settings = {
            userInterfaceLanguage: {
                '_xml:lang': 'en'
            },
            metadataEndpoint: '',
            sparqlEndpoint: '',
            requiresValidation: true,
            baseDocument: '',
            xsltChain: [{xslt: ''}],
        };
    }
}
