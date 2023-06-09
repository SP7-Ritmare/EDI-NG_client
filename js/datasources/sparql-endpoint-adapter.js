class SparqlEndpointAdapter {
    constructor(url, endpoint) {
        this.url = url
        this.endpoint = endpoint
    }

    query(query, callback, errorCallback) {
        const payload = {
            url: this.url.toString(),
            query: this.endpoint.getQueryStringData(query),
            method: this.endpoint.parameters.method,
            accepts: this.endpoint.parameters.contentType.json
        }
        console.log('query', payload)
        const jqXHR = $.ajax({
            url: '/api/datasources/test',
            type: 'POST',
            accept: this.endpoint.parameters.contentType.json,
            dataType: "json",
            crossDomain: true,
            data: JSON.stringify(payload),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                if ( typeof callback === "function") {
                    callback(data);
                }
            },
            error: function() {
                logger.log(arguments);
                if ( typeof errorCallback === "function") {
                    errorCallback(arguments);
                }
            }
        });
        return jqXHR
    }
}
