/**
 * @class
 * @author Fabio Pavesi (fabio@adamassoft.it)
 *
 * @property {String} baseParams.id - the ID
 * @property {String} baseParams.method - "GET" or "POST"
 * @property {String} baseParams.queryParameter - name of the querystring parameter representing the actual query: default is "query"
 * @property {Map<String, String>} baseParams.contentType
 * @property {Object} baseParams.parameters
 *
 */
var EndpointType = function(params) {
    var logger = new Logger(availableContexts.ENDPOINTTYPE);
    var baseParams = {
        id: undefined,
        method: "GET",
        queryParameter: "query",
        contentType: {
            json: "application/sparql-results+json;charset=utf-8,application/json;charset=utf-8",
            jsonp: "application/sparql-results+json; charset=utf-8, application/json; charset=utf-8"
        },
        parameters: {}
    };

    var parameters = clone(baseParams);
    for ( var key in params ) {
        parameters[key] = params[key];
    }

    function getQueryStringData(query) {
        var qs = clone(parameters.parameters);
        logger.log(qs);
        qs[parameters.queryParameter] = query;
        return qs;
    }

    return {
        parameters: parameters,
        /**
         *
         * @memberOf EndpointType
         * @param query
         * @returns {Object}
         */
        getQueryStringData: getQueryStringData
    }
};