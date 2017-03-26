/**
 * Created by fabio on 02/03/2017.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Datasource_1 = require('../../model/Datasource');
var http_1 = require('@angular/http');
var XML2JSON_1 = require('../../utils/XML2JSON');
var util_1 = require('util');
var State_1 = require('../../model/State');
var Element_1 = require('../../model/Element');
var EndpointType_1 = require('../../model/EndpointType');
var Endpoint_1 = require('../../model/Endpoint');
var logger_1 = require('../../utils/logger');
var EDITemplate = (function () {
    function EDITemplate(http) {
        this.http = http;
        this.x2js = new XML2JSON_1.XML2JSON();
        this.logger = new logger_1.Logger(logger_1.availableContexts.EDI_TEMPLATE_SERVICE);
    }
    EDITemplate.prototype.importEndpointTypes = function () {
        console.log('importEndpointTypes', this.contents.endpointTypes);
        for (var _i = 0, _a = this.contents.endpointTypes.endpointType; _i < _a.length; _i++) {
            var et = _a[_i];
            console.log(et);
            var endpointType = new EndpointType_1.EndpointType(et);
        }
    };
    EDITemplate.prototype.importDatasources = function () {
        var defaultMetadataEndpoint = this.contents.settings.metadataEndpoint;
        console.log('importDatasources', this.contents.datasources);
        for (var _i = 0, _a = this.contents.datasources.codelist; _i < _a.length; _i++) {
            var ds = _a[_i];
            var d = new Datasource_1.CodelistDatasource();
            d.fromTemplate(ds);
        }
        console.log('imported codelists', Datasource_1.BaseDatasource.datasources);
        for (var _b = 0, _c = this.contents.datasources.singleton; _b < _c.length; _b++) {
            var ds = _c[_b];
            var d = new Datasource_1.SingletonDatasource();
            d.fromTemplate(ds);
        }
        console.log('imported datasources', Datasource_1.BaseDatasource.datasources);
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
    };
    EDITemplate.prototype.fixDatasources = function () {
        for (var _i = 0, _a = Datasource_1.BaseDatasource.datasources; _i < _a.length; _i++) {
            var ds = _a[_i];
            if (ds instanceof Datasource_1.SingletonDatasource) {
                ds.fixTriggerItem();
            }
        }
    };
    EDITemplate.prototype.fixArrays = function () {
        var object = this.contents;
        console.log('fixArrays', this.contents);
        if (!util_1.isArray(object.group)) {
            object.group = [object.group];
        }
        if (!util_1.isArray(object.endpointTypes.endpointType)) {
            object.endpointTypes.endpointType = [object.endpointTypes.endpointType];
        }
        if (!util_1.isArray(object.datasources)) {
            //            object.datasources = [object.datasources];
            console.log('object.datasources', object.datasources);
            // let temp: any[] = [];
            for (var ds in object.datasources) {
                if (object.datasources.hasOwnProperty(ds)) {
                    console.log('fixDatasources', ds, object.datasources[ds]);
                    if (!util_1.isArray(object.datasources[ds])) {
                        // temp.push([object.datasources[ds]]);
                        object.datasources[ds] = [object.datasources[ds]];
                    }
                    else {
                    }
                }
            }
            // object.datasources = temp;
            console.log('object.datasources out', object.datasources);
        }
        for (var _i = 0, _a = object.group; _i < _a.length; _i++) {
            var g = _a[_i];
            if (!util_1.isArray(g.element)) {
                g.element = [g.element];
            }
            for (var _b = 0, _c = g.element; _b < _c.length; _b++) {
                var e = _c[_b];
                if (!util_1.isArray(e.produces.item)) {
                    e.produces.item = [e.produces.item];
                }
                for (var _d = 0, _e = e.produces.item; _d < _e.length; _d++) {
                    var i = _e[_d];
                    i.id = e.id + '_' + i.hasIndex;
                }
            }
        }
        return object;
    };
    EDITemplate.prototype.fixBooleans = function () {
        var object = Object.assign({}, this.contents);
        object.settings.requiresValidation = (object.requiresValidation === 'true');
        return object;
    };
    EDITemplate.prototype.fixGroupsElementsAndItems = function () {
        var object = Object.assign({}, this.contents);
        console.log('fixGroupsElementsAndItems', object);
        for (var _i = 0, _a = object.group; _i < _a.length; _i++) {
            var g = _a[_i];
            console.log('group', g);
            var elements = [];
            for (var _b = 0, _c = g.element; _b < _c.length; _b++) {
                var e = _c[_b];
                console.log('element', e);
                var temp = new Element_1.Element();
                temp.fromTemplateElement(e);
                console.log('created element', temp);
                elements.push(temp);
            }
            g.element = elements;
        }
        return object;
    };
    EDITemplate.prototype.inferVersion = function () {
        if (this.contents.settings.userInterfaceLanguage) {
            State_1.State.templateVersion = 2;
        }
        else {
            State_1.State.templateVersion = 1;
        }
    };
    EDITemplate.prototype.toEDIML = function () {
    };
    EDITemplate.prototype.load = function (filename) {
        var _this = this;
        this.path = filename;
        State_1.State.templateName = filename;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/xml');
        Endpoint_1.Endpoint.http = this.http;
        return this.http.get(filename, {
            headers: headers
        })
            .map(function (res) {
            _this.contents = _this.x2js.xml2json(res.text()).template;
            _this.inferVersion();
            console.log('template version is ' + State_1.State.templateVersion);
            _this.contents = _this.fixArrays();
            _this.contents = _this.fixBooleans();
            State_1.State.template = _this.contents;
            _this.importEndpointTypes();
            _this.importDatasources();
            _this.contents = _this.fixGroupsElementsAndItems();
            console.log(1111111);
            _this.fixDatasources();
            console.log(2222222);
            State_1.State.interfaceLanguage = _this.contents.settings.userInterfaceLanguage['_xml:lang'];
            console.log('Contents: ', _this.contents);
            return _this.contents;
        });
    };
    EDITemplate = __decorate([
        core_1.Injectable()
    ], EDITemplate);
    return EDITemplate;
}());
exports.EDITemplate = EDITemplate;
