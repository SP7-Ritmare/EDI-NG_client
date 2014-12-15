/**
 * Created by fabio on 18/11/14.
 */

var adapters = (function() {
    function sparqlAdapter(dataset) {
        var data = dataset.results.bindings;
        var results = [];
        for ( var i = 0; i < data.length; i++ ) {
            var record = {};
            record.ttValue = ( data[i].c ? data[i].c.value : ( data[i].uri ? data[i].uri.value : "" ) );
            for ( var field in data[i] ) {
                record[field] = data[i][field].value;
            }
            results.push(record);
        }
        return results;
    }
    return {
        sparql: sparqlAdapter
    }
})();