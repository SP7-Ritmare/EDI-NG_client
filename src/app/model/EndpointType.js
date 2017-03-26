"use strict";
var logger_1 = require('../utils/logger');
var EndpointTypeAdapter_1 = require('./EndpointTypeAdapter');
;
var ContentTypes = (function () {
    function ContentTypes() {
    }
    return ContentTypes;
}());
exports.ContentTypes = ContentTypes;
var baseParams = {
    id: undefined,
    method: 'GET',
    queryParameter: 'query',
    contentType: ContentTypes.sparqlJSON,
    parameters: []
};
(function (HTTPMethod) {
    HTTPMethod[HTTPMethod["GET"] = 0] = "GET";
    HTTPMethod[HTTPMethod["POST"] = 1] = "POST";
})(exports.HTTPMethod || (exports.HTTPMethod = {}));
var HTTPMethod = exports.HTTPMethod;
var EndpointType = (function () {
    /*
        constructor(e: IEndpointType) {
            this.id = e.id;
            this.method = e.method;
            this.queryParameter = e.queryParameter;
            this.parameters = e.parameters;
            EndpointType.endpointTypes.push(this);
        }
    */
    function EndpointType(e) {
        this.logger = new logger_1.Logger(logger_1.availableContexts.ENDPOINTTYPE);
        this.id = e['_xml:id'];
        this.method = (e._method === 'GET' ? HTTPMethod.GET : HTTPMethod.POST);
        this.contentType = e.contentType;
        this.queryParameter = e._queryParameter;
        this.parameters = [];
        for (var _i = 0, _a = e.parameters.parameter; _i < _a.length; _i++) {
            var p = _a[_i];
            this.parameters.push({
                name: p._name,
                value: p._value
            });
        }
        EndpointType.endpointTypes.push(this);
    }
    EndpointType.find = function (id) {
        for (var _i = 0, _a = EndpointType.endpointTypes; _i < _a.length; _i++) {
            var e = _a[_i];
            if (e.id === id) {
                return e;
            }
        }
        return undefined;
    };
    Object.defineProperty(EndpointType.prototype, "adapter", {
        get: function () {
            if (this.contentType === ContentTypes.sparqlJSON || this.contentType === ContentTypes.sparqlJSONP) {
                return EndpointTypeAdapter_1.EndpointTypeAdapter.sparqlAdapter;
            }
            if (this.contentType === ContentTypes.JSON) {
                return EndpointTypeAdapter_1.EndpointTypeAdapter.jsonAdapter;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    EndpointType.endpointTypes = [];
    return EndpointType;
}());
exports.EndpointType = EndpointType;
