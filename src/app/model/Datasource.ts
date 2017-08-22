import {Endpoint} from './Endpoint';
import {EndpointType} from './EndpointType';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Configuration} from './Configuration';
import {ITemplateSingleton, ITemplateSPARQL, ITemplateCodelist} from './Template';
import {State} from './State';
import {Item} from './Item';
import {availableContexts, Logger} from '../utils/logger';
import {MetadataService} from '../components/service/MetadataService';

/**
 * Created by fabio on 02/03/2017.
 */

export interface IQueryOptions {
    searchParam?: string;
}

export class BaseDatasource {
    static metadataService: MetadataService;

    static datasources: BaseDatasource[] = [];
    static logger: Logger = new Logger(availableContexts.DATASOURCE);
    static counter = 0;
    id: string;
    endpoint: Endpoint;
    query: string;
    // protected _results: BehaviorSubject<any[]> = new BehaviorSubject([]);
    _results: BehaviorSubject<any[]> = new BehaviorSubject([]);
    currentRowNumber: number;
    _currentRow: BehaviorSubject<any> = new BehaviorSubject({});
    _currentRowHolder: any;
    protected baseResults: any[];

    static find(id: string) {
        // BaseDatasource.logger.log('searching for datasource with id', id);
        // BaseDatasource.logger.log('in a set of', BaseDatasource.datasources.length, 'datasources');
        for (let d of BaseDatasource.datasources) {
            // BaseDatasource.logger.log('datasource', d);
            if (d.id === id) {
                // BaseDatasource.logger.log('comparing', d.id, id);
                return d;
            }
        }
        BaseDatasource.logger.log('datasource', id, 'not found', BaseDatasource.datasources);
        return undefined;
    }

    constructor() {
        BaseDatasource.datasources.push(this);
        this._currentRow.subscribe(
            res => this._currentRowHolder = res
        )
    }

    set currentRow(value: any) {
        this._currentRowHolder = value;
        this._currentRow.next(value);
    }

    get currentRow() {
        return this._currentRowHolder;
    }

    duplicate() {
        var _ = require('lodash');
        let ds = _.cloneDeep(this);
        ds.id = ds.id + '.' + (++BaseDatasource.counter);
        ds._results.next([]);
        ds._currentRow.next({});
        ds.currentRowNumber = -1;

        BaseDatasource.datasources.push(ds);

        return ds;
    }

    refresh(options?: IQueryOptions) {
        let query: any = this.query;

        if (query.__cdata) {
            query = query.__cdata;
        }
        BaseDatasource.logger.log('query', this.query);
        if (this.hasOwnProperty('uri')) {
            query = query.split('$uri$').join((this as any)['uri']);
        }
        if (options && options.searchParam) {
            query = query.split('$search_param').join(options.searchParam);
            BaseDatasource.logger.log(query);
        }
        query = query.split('$metadataLanguage$').join(Configuration.metadataLanguage);
        // let results = this.endpoint.query(query);
        //
        if (this.endpoint && query.indexOf('$search_param') < 0) {
            BaseDatasource.logger.log('the endpoint is', this.endpoint.query);
            let dataset = this.endpoint.query(query);
            BaseDatasource.logger.log('dataset', dataset);
            dataset.subscribe(res => {
                this.baseResults = res;
                this._results.next(res);
                BaseDatasource.logger.log('datasource', this.id, this._results);
                if (res.length == 1) {
                    BaseDatasource.logger.log('setting current row to res[0]', res[0]);
                    this.setCurrentRow(res[0]);
                }
            });
        } else {
            if ( !this.endpoint ) {
                console.error('endpoint undefined for datasource', this.id);
            } else {
                // console.error('$search_param is still in the query', this.id, options, query);
            }
        }
    }

    setCurrentRow(values: any) {
        let keys = Object.keys(values).length;
        BaseDatasource.logger.log(this.id, 'setting current row to', values, 'number of keys', keys);
        for (let i = 0; i < this.baseResults.length; i++) {
            let count = 0;
            for (let field in values) {
                if (values.hasOwnProperty(field)) {
                    if (this.baseResults[i].hasOwnProperty(field) && values[field] === this.baseResults[i][field]) {
                        count++;
                    }
                    if (count === keys) {
                        this.currentRowNumber = i;
                        this.currentRow = this.baseResults[i];
                        BaseDatasource.logger.log('row ' + this.currentRowNumber + ' selected', this.baseResults[i]);
                        return;
                    }
                }
            }
        }
    }

    get results(): Observable<any[]> {
        return this._results.asObservable();
    }
}

export interface IDatasource extends BaseDatasource {
    currentRowNumber: number;
    currentRow: any;

    fromTemplate(input: ITemplateSingleton | ITemplateSPARQL | ITemplateCodelist): void;

    setCurrentRow(values: any): void;
}

export interface ICodelist extends BaseDatasource {
    uri: string;
    url?: string;
    query: string;
}

export interface ISPARQL extends BaseDatasource {
    url: string;
    searchItem: string;
    triggerItem: string;
    singleton: boolean;
}

export class CodelistDatasource extends BaseDatasource implements ICodelist {
    uri: string;
    url?: string;
    currentRowNumber: number;
    currentRow: any;

    constructor() {
        super();
        this.query = `PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dct:<http://purl.org/dc/terms/>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX skos:<http://www.w3.org/2004/02/skos/core#>

            SELECT DISTINCT <$uri$> AS ?uri ?c ?l ?a ?z
            WHERE {
            	{
            	  ?c rdf:type skos:Concept. 
            	  ?c skos:inScheme <$uri$>.
            	  OPTIONAL {
            	      ?c skos:prefLabel ?l.
            	      FILTER ( LANG(?l) = "en" )
            	  }
            	}

            	OPTIONAL {
            	    ?c skos:prefLabel ?z.
            	    FILTER ( LANG(?z) = "zxx" )
            	}
            	OPTIONAL {
            	    ?c skos:prefLabel ?a.
            	    FILTER ( LANG(?a) = "$metadataLanguage$" )
            	}
            	
            }
            ORDER BY ASC(?a) ASC(?l)`;
    }

    fromTemplate(input: ITemplateCodelist): void {
        BaseDatasource.logger.log('Codelist fromTemplate', input);
        this.id = input['_xml:id'] as string;
        this.uri = input.uri;
        this.url = input.url || BaseDatasource.metadataService.state.template.settings.sparqlEndpoint;
        let endpointType = EndpointType.find(input._endpointType);
        BaseDatasource.logger.log('codelist ', this.id, input._endpointType, endpointType);
        this.endpoint = Endpoint.find(endpointType, this.url);
        BaseDatasource.logger.log('Codelist fromTemplate OUT', this);
        /*
         if ( this.uri && this.endpoint ) {
         this.refresh();
         }
         */
    }
}

export class SPARQLDatasource extends BaseDatasource implements ISPARQL {
    id: string;
    url: string;
    endpoint: Endpoint;
    query: string;
    searchItem: string;
    triggerItem: string;
    singleton: false;
    // protected _results: BehaviorSubject<any[]> = new BehaviorSubject([]);
    // public results: Observable<any[]> = this._results.asObservable();
    currentRowNumber: number = -1;
    currentRow: any;

    fromTemplate(input: ITemplateSPARQL): void {
        BaseDatasource.logger.log('SPARQL fromTemplate', input);
        this.id = input['_xml:id'] as string;
        this.url = input.url || BaseDatasource.metadataService.state.template.settings.sparqlEndpoint;
        this.query = input.query;

        let endpointType = EndpointType.find(input._endpointType);
        BaseDatasource.logger.log('codelist ', this.id, input._endpointType, endpointType);
        this.endpoint = Endpoint.find(endpointType, this.url);
        BaseDatasource.logger.log('Singleton fromTemplate OUT', this);
        /*
         if ( this.uri && this.endpoint ) {
         this.refresh();
         }
         */
    }
}

export class SingletonDatasource extends BaseDatasource implements ISPARQL {
    id: string;
    endpoint: Endpoint;
    url: string;
    query: string;
    searchItem: string;
    triggerItem: string;
    triggerItemObject: Item;
    singleton: true;
    currentRowNumber: number = -1;
    currentRow: any;

    fixTriggerItem() {
        BaseDatasource.logger.log('fixTriggerItem');
        if (this.triggerItem) {
            if (this.triggerItem.indexOf('_uri') >= 0) {
                this.triggerItemObject = BaseDatasource.metadataService.state.getItem(this.triggerItem.replace('_uri', ''));
                if (this.triggerItemObject) {
                    BaseDatasource.logger.log('creating observer for', this.triggerItem);
                    this.triggerItemObject.valueObject().subscribe(
                        res => {
                            if (res) {
                                BaseDatasource.logger.log('trigger detected', this.triggerItem, this.triggerItemObject.value, res);
                                this.refresh({searchParam: res.c});
                            }
                        },
                        err => {
                            BaseDatasource.logger.log('trigger error', err);
                        },
                        () => {
                            BaseDatasource.logger.log('trigger done');
                        }
                    )
                } else {
                    console.error('trigger item ', this.triggerItem, ' not found');
                }
            } else {
                this.triggerItemObject = BaseDatasource.metadataService.state.getItem(this.triggerItem);
                if (this.triggerItemObject) {
                    this.triggerItemObject.valueObject().subscribe(
                        res => {
                            if (res) {
                                BaseDatasource.logger.log('trigger detected', this.triggerItem, this.triggerItemObject.value, res);
                                this.refresh({searchParam: res.l});
                            }
                        },
                        err => {
                            BaseDatasource.logger.log('trigger error', err);
                        },
                        () => {
                            BaseDatasource.logger.log('trigger done');
                        }
                    )
                } else {
                    console.error('trigger item ', this.triggerItem, ' not found');
                }
            }
            BaseDatasource.logger.log('triggerItemObject', this.triggerItemObject);
        }
    }

    duplicate() {
        return this;
    }

    fromTemplate(input: ITemplateSingleton): void {
        BaseDatasource.logger.log('Singleton fromTemplate', input);
        this.id = input['_xml:id'] as string;
        this.url = input.url || BaseDatasource.metadataService.state.template.settings.sparqlEndpoint;
        this.query = input.query;
        this.triggerItem = input._triggerItem;

        let endpointType = EndpointType.find(input._endpointType);
        BaseDatasource.logger.log('codelist ', this.id, input._endpointType, endpointType);
        this.endpoint = Endpoint.find(endpointType, this.url);
        BaseDatasource.logger.log('Singleton fromTemplate OUT', this);
        /*
         if ( this.uri && this.endpoint ) {
         this.refresh();
         }
         */
    }
}

