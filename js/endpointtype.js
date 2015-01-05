/**
 * Created by fabio on 05/01/15.
 */

var EndpointType = function(params) {
    var baseParams = {
        id: undefined,
        method: "GET",
        queryParameter: "query",
        parameters: {}
    };

    var parameters = clone(baseParams);
    for ( var key in params ) {
        parameters[key] = params[key];
    }

    function getQueryStringData(query) {
        var qs = clone(parameters.parameters);
        console.log(qs);
        qs[parameters.queryParameter] = query;
        return qs;
    }

    return {
        parameters: parameters,
        getQueryStringData: getQueryStringData
    }
};