var availableContexts = {
    DATASOURCE: "datasource",
    DATASOURCE_POOL: "datasourcepool",
    EDI: "edi",
    EDIML: "ediml",
    TEXTBOX: "textbox",
    COMBO: "combo",
    AUTOCOMPLETION: "autocompletion",
    BOOLEAN: "bool",
    DATE: "date",
    DATE_RANGE: "daterange",
    FUNCTION: "function",
    IMAGE: "image",
    LABEL: "label",
    QRCODE: "qrcode",
    BBOX: "bbox",
    ENDPOINTTYPE: "endpointtype",
    ITEM: "item",
    SPARQL: "sparql"
}
var enabledContexts = [
    /*
    "reorderElement",
    "duplicator",
     availableContexts.DATASOURCE,
     availableContexts.EDI
    */
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
var Logger = (function(context) {
    var _context = context;
    var outputContext = false;


    function log(arg) {
        if ($.inArray(_context, enabledContexts) > -1 ) {
            if ( outputContext ) {
                console.log("context: " + _context);
            }
            console.log(arg);
        }
    }
    function error(arg) {
        console.error(arg);
        return;
        if ($.inArray(_context, enabledContexts) > -1 ) {
            if ( outputContext ) {
                console.error("context: " + _context);
            }
            console.error(arg);
        }
    }
    function warn(arg) {
        if ($.inArray(_context, enabledContexts) > -1 ) {
            if ( outputContext ) {
                console.warn("context: " + _context);
            }
            console.warn(arg);
        }
    }

    return {
        log: log,
        error: error,
        warn: warn

    }
});