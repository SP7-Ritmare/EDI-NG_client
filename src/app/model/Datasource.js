"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Endpoint_1 = require('./Endpoint');
var EndpointType_1 = require('./EndpointType');
var rxjs_1 = require('rxjs');
var Configuration_1 = require('./Configuration');
var State_1 = require('./State');
var BaseDatasource = (function () {
    function BaseDatasource() {
        // protected _results: BehaviorSubject<any[]> = new BehaviorSubject([]);
        this._results = new rxjs_1.BehaviorSubject([]);
        this._currentRow = new rxjs_1.BehaviorSubject({});
        BaseDatasource.datasources.push(this);
    }
    BaseDatasource.find = function (id) {
        // console.log('searching for datasource with id', id);
        // console.log('in a set of', BaseDatasource.datasources.length, 'datasources');
        for (var _i = 0, _a = BaseDatasource.datasources; _i < _a.length; _i++) {
            var d = _a[_i];
            // console.log('datasource', d);
            if (d.id === id) {
                console.log('comparing', d.id, id);
                return d;
            }
        }
        console.log('datasource', id, 'not found');
        return undefined;
    };
    Object.defineProperty(BaseDatasource.prototype, "currentRow", {
        set: function (value) {
            this._currentRow.next(value);
        },
        enumerable: true,
        configurable: true
    });
    BaseDatasource.prototype.refresh = function (options) {
        var _this = this;
        var query = this.query;
        if (this.hasOwnProperty('uri')) {
            query = query.split('$uri$').join(this['uri']);
        }
        if (options && options.searchParam) {
            query = query.split('$search_param').join(options.searchParam);
            console.log(query);
        }
        query = query.split('$metadataLanguage$').join(Configuration_1.Configuration.metadataLanguage);
        // let results = this.endpoint.query(query);
        //
        if (this.endpoint && query.indexOf('$search_param') < 0) {
            console.log('the endpoint is', this.endpoint.query);
            var dataset = this.endpoint.query(query);
            console.log('dataset', dataset);
            dataset.subscribe(function (res) {
                _this.baseResults = res;
                _this._results.next(res);
                console.log('datasource', _this.id, _this._results);
                if (res.length == 1) {
                    _this.setCurrentRow(res[0]);
                }
            });
        }
        else {
            console.error('endpoint undefined for datasource', this.id);
        }
    };
    BaseDatasource.prototype.setCurrentRow = function (values) {
        for (var i = 0; i < this.baseResults.length; i++) {
            var count = 0;
            var keys = Object.keys(values).length;
            for (var field in values) {
                if (values.hasOwnProperty(field)) {
                    if (this.baseResults[i].hasOwnProperty(field) && values[field] === this.baseResults[i][field]) {
                        count++;
                    }
                    if (count === keys) {
                        this.currentRowNumber = i;
                        this.currentRow = this.baseResults[i];
                        console.log('row ' + this.currentRowNumber + ' selected', this.currentRow);
                        return;
                    }
                }
            }
        }
    };
    Object.defineProperty(BaseDatasource.prototype, "results", {
        get: function () {
            return this._results.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    BaseDatasource.datasources = [];
    return BaseDatasource;
}());
exports.BaseDatasource = BaseDatasource;
var CodelistDatasource = (function (_super) {
    __extends(CodelistDatasource, _super);
    function CodelistDatasource() {
        _super.call(this);
        this.query = "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n            PREFIX dct:<http://purl.org/dc/terms/>\n            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n            PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n\n            SELECT DISTINCT <$uri$> AS ?uri ?c ?l ?a ?z\n            WHERE {\n            \t{\n            \t  ?c rdf:type skos:Concept. \n            \t  ?c skos:inScheme <$uri$>.\n            \t  OPTIONAL {\n            \t      ?c skos:prefLabel ?l.\n            \t      FILTER ( LANG(?l) = \"en\" )\n            \t  }\n            \t}\n\n            \tOPTIONAL {\n            \t    ?c skos:prefLabel ?z.\n            \t    FILTER ( LANG(?z) = \"zxx\" )\n            \t}\n            \tOPTIONAL {\n            \t    ?c skos:prefLabel ?a.\n            \t    FILTER ( LANG(?a) = \"$metadataLanguage$\" )\n            \t}\n            \t\n            }\n            ORDER BY ASC(?a) ASC(?l)";
    }
    CodelistDatasource.prototype.fromTemplate = function (input) {
        console.log('Codelist fromTemplate', input);
        this.id = input['_xml:id'];
        this.uri = input.uri;
        this.url = input.url || State_1.State.template.settings.sparqlEndpoint;
        var endpointType = EndpointType_1.EndpointType.find(input._endpointType);
        console.log('codelist ', this.id, input._endpointType, endpointType);
        this.endpoint = Endpoint_1.Endpoint.find(endpointType, this.url);
        console.log('Codelist fromTemplate OUT', this);
        /*
                if ( this.uri && this.endpoint ) {
                    this.refresh();
                }
        */
    };
    return CodelistDatasource;
}(BaseDatasource));
exports.CodelistDatasource = CodelistDatasource;
var SPARQLDatasource = (function (_super) {
    __extends(SPARQLDatasource, _super);
    function SPARQLDatasource() {
        _super.apply(this, arguments);
        // protected _results: BehaviorSubject<any[]> = new BehaviorSubject([]);
        // public results: Observable<any[]> = this._results.asObservable();
        this.currentRowNumber = -1;
    }
    return SPARQLDatasource;
}(BaseDatasource));
exports.SPARQLDatasource = SPARQLDatasource;
var SingletonDatasource = (function (_super) {
    __extends(SingletonDatasource, _super);
    function SingletonDatasource() {
        _super.apply(this, arguments);
        this.currentRowNumber = -1;
    }
    SingletonDatasource.prototype.fixTriggerItem = function () {
        var _this = this;
        console.log('fixTriggerItem');
        if (this.triggerItem) {
            if (this.triggerItem.indexOf('_uri') >= 0) {
                this.triggerItemObject = State_1.State.getItem(this.triggerItem.replace('_uri', ''));
                if (this.triggerItemObject) {
                    console.log('creating observer for', this.triggerItem);
                    this.triggerItemObject.valueObject().subscribe(function (res) {
                        console.log('trigger detected', _this.triggerItemObject.value, res);
                        _this.refresh({ searchParam: res.c });
                    });
                }
            }
            else {
                this.triggerItemObject = State_1.State.getItem(this.triggerItem);
                if (this.triggerItemObject) {
                    this.triggerItemObject.valueObject().subscribe(function (res) {
                        console.log('trigger detected', _this.triggerItemObject.value, res);
                        _this.refresh({ searchParam: res.l });
                    });
                }
            }
            console.log('triggerItemObject', this.triggerItemObject);
        }
    };
    SingletonDatasource.prototype.fromTemplate = function (input) {
        console.log('Singleton fromTemplate', input);
        this.id = input['_xml:id'];
        this.url = input.url || State_1.State.template.settings.sparqlEndpoint;
        this.query = input.query;
        this.triggerItem = input._triggerItem;
        var endpointType = EndpointType_1.EndpointType.find(input._endpointType);
        console.log('codelist ', this.id, input._endpointType, endpointType);
        this.endpoint = Endpoint_1.Endpoint.find(endpointType, this.url);
        console.log('Singleton fromTemplate OUT', this);
        /*
         if ( this.uri && this.endpoint ) {
         this.refresh();
         }
         */
    };
    return SingletonDatasource;
}(BaseDatasource));
exports.SingletonDatasource = SingletonDatasource;
