/**
 * SPARQL query manager
 *
 * @class
 * @author Fabio Pavesi (fabio@adamassoft.it)
 *
 */
var SPARQL = (function(url, endpointType) {
    var logger = new Logger(availableContexts.SPARQL);
    var virtuosoUrl = "http://sp7.irea.cnr.it:8890/sparql";
    if ( typeof endpointType === "undefined" ) {
        endpointType = "virtuoso";
    }

    if ( typeof url !== "undefined") {
        virtuosoUrl = url;
    }
    function getSparqlQuery(uri, currentMetadataLanguage) {
        var sparql;
        sparql =    "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> " +
                    "PREFIX dct:<http://purl.org/dc/terms/> " +
                    "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                    "PREFIX skos:<http://www.w3.org/2004/02/skos/core#> " +
                    
                    "SELECT DISTINCT <" + uri + "> AS ?uri ?c ?l ?a ?z " +
                    "WHERE { " +
                    "	{ " +
                    "	  ?c rdf:type skos:Concept. " +
                    "	  ?c skos:inScheme <" + uri + ">. " +
                    "	  OPTIONAL { " +
                    "	      ?c skos:prefLabel ?l. " +
                    '	      FILTER ( LANG(?l) = "en" ) ' +
                    "	  } " +
                    "	} " +
                            
                    "	OPTIONAL { " +
                    "	    ?c skos:prefLabel ?z. " + 
                    '	    FILTER ( LANG(?z) = "zxx" ) ' +
                    "	} " +
                    "	OPTIONAL { " +
                    "	    ?c skos:prefLabel ?a. " + 
                    '	    FILTER ( LANG(?a) = "' + currentMetadataLanguage + '" ) ' +
                    "	} " +
                    "	" +
                    "} " +
                                    "ORDER BY ASC(?a) ASC(?l)";
                                    // doDebug(sparql);
        return sparql;
    };

    function specificQuery(query, callback, errorCallback, language) {
        if ( typeof language === "undefined" ) {
            language = "it";
        }
        var newQuery = query.toString().replace(/\$lang\$/g, language);
/*
        Escaping of parentheses
            .replace(/\(/g, "\\(")
            .replace(/\)/g, "\\)");
*/
        logger.log(endpointType);
        var jqXHR = $.ajax({
            url: virtuosoUrl,
            type: endpointType.parameters.method,
            accepts: endpointType.parameters.contentType.json,
            dataType: "json",
            crossDomain: true,
            /*
            data: {
                query: newQuery,
                format: "application/sparql-results+json",
                save:"display",
                fname : undefined
            },
            */
            data: endpointType.getQueryStringData(newQuery),
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
        return jqXHR;
    }

    function query(uri, callback, errorCallback, language) {
        if ( typeof language === "undefined" ) {
            language = "it";
        }
        var sparqlQuery = getSparqlQuery(uri, language);
        var jqXHR = $.ajax({
            url: virtuosoUrl,
            type: endpointType.parameters.method,
            accepts: endpointType.parameters.contentType.json,
            dataType: "json",
            crossDomain: true,
            /*
            data: {
                query: sparqlQuery,
                format: "application/sparql-results+json",
                save:"display",
                fname : undefined
            },
            */
            data: endpointType.getQueryStringData(sparqlQuery),
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
        return jqXHR;
    }
    return {
        /**
         * Returns a SPARQL query for a codelist's URI
         *
         * @memberOf SPARQL
         * @param uri
         * @param currentMetadataLanguage
         * @returns {string}
         */
        getSparqlQuery: getSparqlQuery,
        /**
         * Performs a URI based SPARQL query
         *
         * @memberOf SPARQL
         * @param uri
         * @param callback
         * @param errorCallback
         * @param language
         */
        query: query,
        /**
         * Runs a specific SPARQL query
         *
         * @memberOf SPARQL
         * @param query
         * @param callback
         * @param errorCallback
         * @param language
         */
        specificQuery: specificQuery
    };
});

