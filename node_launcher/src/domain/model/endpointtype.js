import {Logger, availableContexts} from "../../utils/logger.js";

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
export class EndpointType {
    constructor(params) {
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

        this.parameters = Object.assign({}, baseParams);
        for ( let key in params ) {
            this.parameters[key] = params[key];
        }
        this.parameters.id = this.parameters['_xml:id']
    }

    getQueryStringData(query) {
        var qs = clone(this.parameters.parameters);
        logger.log(qs);
        qs[this.parameters.queryParameter] = query;
        return qs;
    }

};
