var paths = [
    "defaults",
    "localised_strings",
    "validator",
    "logger",
    "jquery-ui",
    "utils",
    "sparql",
    "endpointtype",
    "datasource_adapters",
    "datasource",
    "datasourcepool",
    "item",
    "element",
    "ediml",
    "edi",
    "xml2json",
    "typeahead.jquery",
    <!-- HTML control renderers -->
    "jquery.string.1.1.0-min",
    "bootstrap.min",
    "bootstrap-datepicker",
    "langs",
    "prettify/run_prettify",
    "prettify/prettify",
    "jquery-dateFormat.min",
    "raphael-2.1.0-min",
    "qrcodesvg",
    "renderers/autocompletion",
    "renderers/boolean",
    "renderers/bounding_box",
    "renderers/combobox",
    "renderers/date",
    "renderers/date_range",
    "renderers/function",
    "renderers/image",
    "renderers/label",
    "renderers/qrcode",
    "renderers/textbox",
    "renderers/generic",
];
var counter = 0;

for ( var i = 0; i < paths.length; i++ ) {
    counter++;
    $.getScript("js/" + paths[i] + ".js")
        .error(function() {
            counter--;
            console.error(arguments);
            if (counter == 0) {
                startUp();
            }
        })
        .done(function() {
            counter--;
            if (counter == 0) {
                startUp();
            }
        });
}

