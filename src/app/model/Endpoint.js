"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EndpointType_1 = require('./EndpointType');
var http_1 = require('@angular/http');
var logger_1 = require('../utils/logger');
var rxjs_1 = require('rxjs');
var core_1 = require('@angular/core');
// Import RxJs required methods
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
/**
 * Created by fabio on 08/03/2017.
 */
var Endpoint = (function () {
    function Endpoint(endpointType, url) {
        this.logger = new logger_1.Logger(logger_1.availableContexts.ENDPOINT);
        this.endpointType = endpointType;
        this.url = url;
        Endpoint.endpoints.push(this);
    }
    Endpoint.find = function (endpointType, url) {
        for (var _i = 0, _a = Endpoint.endpoints; _i < _a.length; _i++) {
            var e = _a[_i];
            if (e.endpointType === endpointType && e.url === url) {
                return e;
            }
        }
        return new Endpoint(endpointType, url);
    };
    Endpoint.prototype.query = function (query) {
        var _this = this;
        var result = new rxjs_1.BehaviorSubject([]);
        switch (this.endpointType.method) {
            case EndpointType_1.HTTPMethod.GET:
                var qs = this.url + '?';
                for (var _i = 0, _a = this.endpointType.parameters; _i < _a.length; _i++) {
                    var p = _a[_i];
                    qs += encodeURIComponent(p.name) + '=' + encodeURIComponent(p.value) + '&';
                }
                var headers = new http_1.Headers({});
                qs += encodeURIComponent(this.endpointType.queryParameter) + '=' + encodeURIComponent(query);
                var options = new http_1.RequestOptions({
                    headers: headers
                });
                console.log('HTTP GET ' + qs);
                Endpoint.http
                    .get(qs, options)
                    .map(function (res) {
                    console.log('Res: ', res);
                    if (_this.endpointType.contentType === EndpointType_1.ContentTypes.JSON ||
                        _this.endpointType.contentType === EndpointType_1.ContentTypes.sparqlJSON ||
                        _this.endpointType.contentType === EndpointType_1.ContentTypes.sparqlJSONP) {
                        return _this.endpointType.adapter(res.json());
                    }
                    return _this.endpointType.adapter(res);
                })
                    .subscribe(function (res) {
                    console.log('endpoint query results', res);
                    result.next(res);
                }, function (err) {
                    console.log(err);
                });
                break;
            case EndpointType_1.HTTPMethod.POST:
                this.logger.error('POST is not implemented yet');
                break;
            default:
                this.logger.error(this.endpointType.method + ' is not implemented yet');
        }
        return result.asObservable();
    };
    Endpoint.endpoints = [];
    Endpoint = __decorate([
        core_1.Injectable()
    ], Endpoint);
    return Endpoint;
}());
exports.Endpoint = Endpoint;
