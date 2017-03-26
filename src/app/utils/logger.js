"use strict";
exports.availableContexts = {
    DATASOURCE: 'datasource',
    DATASOURCE_POOL: 'datasourcepool',
    EDI: 'edi',
    EDIML: 'ediml',
    TEXTBOX: 'textbox',
    COMBO: 'combo',
    AUTOCOMPLETION: 'autocompletion',
    BOOLEAN: 'bool',
    DATE: 'date',
    DATE_RANGE: 'daterange',
    FUNCTION: 'function',
    IMAGE: 'image',
    LABEL: 'label',
    QRCODE: 'qrcode',
    BBOX: 'bbox',
    ENDPOINTTYPE: 'endpointtype',
    ENDPOINT: 'endpoint',
    ITEM: 'item',
    SPARQL: 'sparql',
    EDI_TEMPLATE_SERVICE: 'EDI_TEMPLATE_SERVICE'
};
exports.enabledContexts = [
    /*
     'reorderElement',
     'duplicator',
     availableContexts.DATASOURCE,
     availableContexts.EDI
     */
    exports.availableContexts.ENDPOINT,
    exports.availableContexts.ENDPOINTTYPE
];
/*
 console.nativeError = console.error;
 console.nativeLog = console.log;
 window.console.nativeLog = window.console.log;
 window.console.log = console.log = function(what) {
 console.nativeLog(what);
 }
 window.console.error = console.error = function(what) {
 console.nativeError(what);
 }
 */
var Logger = (function () {
    function Logger(context) {
        this._context = context;
    }
    Logger.prototype.log = function (arg) {
        var _this = this;
        if (exports.enabledContexts.some(function (x) { return x === _this._context; })) {
            if (this.outputContext) {
                console.error('context: ' + this._context);
            }
            console.log(this._context, arg);
        }
    };
    Logger.prototype.error = function (arg) {
        console.error(arg);
        return;
        /*       if (enabledContexts.some(x => x === this._context)) {
                   if (this.outputContext) {
                       console.error('context: ' + this._context);
                   }
                   console.error(arg);
               }
        */ };
    Logger.prototype.warn = function (arg) {
        var _this = this;
        if (exports.enabledContexts.some(function (x) { return x === _this._context; })) {
            if (this.outputContext) {
                console.error('context: ' + this._context);
            }
            console.warn(arg);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
