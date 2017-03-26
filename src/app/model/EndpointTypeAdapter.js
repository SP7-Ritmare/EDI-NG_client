"use strict";
/**
 * Created by fabio on 08/03/2017.
 */
var EndpointTypeAdapter = (function () {
    function EndpointTypeAdapter() {
    }
    EndpointTypeAdapter.sparqlAdapter = function (dataset) {
        console.log('SPARQL adapter', dataset);
        var data = dataset.results.bindings;
        var results = [];
        for (var i = 0; i < data.length; i++) {
            var record = {};
            record.ttValue = (data[i].c ? data[i].c.value : (data[i].uri ? data[i].uri.value : ""));
            for (var field in data[i]) {
                if (data[i].hasOwnProperty(field)) {
                    record[field] = data[i][field].value;
                }
            }
            results.push(record);
        }
        console.log('SPARQL adapter results: ', results);
        return results;
    };
    EndpointTypeAdapter.jsonAdapter = function (res) {
        var retVal = res.json();
        console.log('JSON adapter');
        return retVal;
    };
    return EndpointTypeAdapter;
}());
exports.EndpointTypeAdapter = EndpointTypeAdapter;
