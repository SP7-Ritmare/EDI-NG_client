export const availableContexts = {
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
}
export const enabledContexts: any[] = [
    /*
     'reorderElement',
     'duplicator',
     availableContexts.DATASOURCE,
     availableContexts.EDI
     */
    availableContexts.ENDPOINT,
    availableContexts.ENDPOINTTYPE
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

export class Logger {
    _context: string;
    outputContext: boolean;

    constructor(context: string) {
        this._context = context;
    }

    log(arg: any) {
        if (enabledContexts.some(x => x === this._context)) {
            if (this.outputContext) {
                console.error('context: ' + this._context);
            }
            console.log(this._context, arg);
        }
    }

    error(arg: any) {
        console.error(arg);
        return;
 /*       if (enabledContexts.some(x => x === this._context)) {
            if (this.outputContext) {
                console.error('context: ' + this._context);
            }
            console.error(arg);
        }
 */   }

    warn(arg: any) {
        if (enabledContexts.some(x => x === this._context)) {
            if (this.outputContext) {
                console.error('context: ' + this._context);
            }
            console.warn(arg);
        }
    }

}