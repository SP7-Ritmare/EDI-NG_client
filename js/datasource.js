/**
 * Enum of all DataSource types
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @readonly
 * @enum
 */
var DataSourceType = {
    // Codelist based on a Virtuoso SPARQL Query
    virtuosoCodelist: "virtuosoCodelist",
    // Issues a generic SPARQL Query
    sparql: "sparql"


};

/**
 * DataSource class
 *
 * @class
 * @author Fabio Pavesi (fabio@adamassoft.it)
 */

var DataSource = function(params) {
    var parameters = {
        /**
         *
         * @memberOf DataSource
         */
        type: DataSourceType.virtuosoCodelist,
        /**
         *
         * @memberOf DataSource
         */
        url: "http://sp7.irea.cnr.it:8890/sparql",
        // URI of the CodeList
        /**
         *
         * @memberOf DataSource
         */
        uri: "",
        /**
         * Callback to be called when data is ready
         *
         * @memberOf DataSource
         * @type Callback
         */
        ready: undefined,
        /**
         * Query to be issued
         * @memberOf DataSource
         * @type String
         */
        query: "",
        /**
         * HTML control whose value represents the $search_param of the query
         *
         * @memberOf DataSource
         */
        searchItem: undefined,
        /**
         * HTML control triggering a refresh in this datasource
         *
         * @memberOf DataSource
         */
        triggerItem: undefined,
        /**
         * if true => requires explicit "refresh"
         *
         * @memberOf DataSource
         */
        lazy: true,
        /**
         * if true => selected row is the same for all items referring to this datasource and all controls are notified if selection changes
         *
         * @memberOf DataSource
         */
        singleton: false,
        /**
         * if true => this datasource is the product of a cloning operation: NEVER FORCE THIS VALUE
         *
         * @memberOf DataSource
         */
        cloned: false,
        /**
         *
         * @memberOf DataSource
         */
        isFreshlyCreated: true,
        /**
         *
         * @memberOf DataSource
         */
        hasResultSet: false,
        /**
         *
         * @memberOf DataSource
         */
        hasErrors: false,
        /**
         *
         * @memberOf DataSource
         */
        errors: undefined,
        /**
         * Adapts dataset format to plain array
         * see datasource_adapters.js
         *
         * @memberOf DataSource
         */
        adapter: undefined
    };
    var resultSet = undefined;
    var currentRow = -1;
    var isLoading = false;
    var language = "it";
    var callbacks = [];
    var listeners = [];

    for ( var key in params ) {
        parameters[key] = params[key];
    }
    if ( typeof DataSourceType[parameters.type] === "undefined" ) {
        throw "Unknown datasource type";
    }

    if ( typeof parameters.adapter === "undefined" && parameters.type == DataSourceType.virtuosoCodelist || parameters.type == DataSourceType.sparql ) {
        parameters.adapter = adapters.sparql;
    }

    if ( typeof parameters.id === "undefined" ) {
        throw "DataSource id is mandatory";
    }
    var self;
    function dataSuccess(data) {
        resultSet = data;
        parameters.isFreshlyCreated = false;
        parameters.hasResultSet = true;
        parameters.hasErrors = false;

        if ( typeof parameters.adapter !== "undefined" ) {
            resultSet = parameters.adapter(data);
        }
/*
        if ( parameters.type == "virtuosoCodelist" ) {
            resultSet = data.results.bindings;
        }
*/
        if ( resultSet.length == 1 ) {
            console.log(parameters.id + " has a single row");
            currentRow = 0;
            trigger("selectionChanged");
        } else {
            console.log(parameters.id + " has " + resultSet.length + " rows");
            console.log(resultSet);
            trigger("selectionChanged");
        }

        // console.log("Data Success " + parameters.id);
        // console.log(resultSet);
        if ( typeof parameters.ready === "function" ) {
            parameters.ready(resultSet);
        }
        for ( var i = 0; i < callbacks.length; i++ ) {
            callbacks[i](resultSet, parameters.id);
        }
        isLoading = false;
        DataSourcePool.getInstance().queryEnd(self);
        trigger("dataLoaded");
        $("*[datasource='" + parameters.id + "']").removeClass("loading");
    }

    function dataError() {
        parameters.isFreshlyCreated = false;
        parameters.hasResultSet = false;
        parameters.hasErrors = true;
        parameters.errors = arguments;

        // console.log("Data Error");
        // console.log(arguments);
        isLoading = false;
        DataSourcePool.getInstance().queryEnd(self);
        $("*[datasource='" + parameters.id + "']").removeClass("loading");
    }

    function loadData(justPrepareLoad) {
        if ( typeof justPrepareLoad === "undefined" ) {
            justPrepareLoad = false;
        }
        if ( isLoading ) {
            return;
        }
        isLoading = true;
        if ( typeof parameters.triggerItem !== "undefined" ) {
            console.log("datasource " + parameters.id + " depends on trigger " + parameters.triggerItem);
            console.log("trigger item has " + $("#" + parameters.triggerItem).length + " occurrences");
            DataSourcePool.getInstance().setDatasourceTrigger(parameters.triggerItem, self);
            /*
             $("#" + ds.parameters.triggerItem).change(function() {
             console.log($(this).attr("id") + " fired change towards datasource " + ds.getId() + " - " + i);

             ds.refresh(false);
             });
             */
        }

        DataSourcePool.getInstance().queryStart(self);
        if ( justPrepareLoad ) {
            return;
        }
        $("*[datasource='" + parameters.id + "']").addClass("loading");
        resultSet = undefined;
        currentResult = -1;
        switch (parameters.type) {
            case DataSourceType.virtuosoCodelist:
                var sparql = new SPARQL(parameters.url, edi.getEndpointTypes(parameters.endpointType));
                // console.log("load data for " + parameters.id);
                sparql.query(parameters.uri, dataSuccess, dataError, language);
                break;
            case DataSourceType.sparql:
                if ( typeof parameters.triggerItem !== "undefined" ) {
                    console.log(parameters.id + " is a datasource triggered by " + parameters.triggerItem);
                    parameters.searchItem = parameters.triggerItem;
                }
                /*
                if ( typeof parameters.searchItem === "undefined" || typeof $("#" + parameters.searchItem) === "undefined" || $("#" + parameters.searchItem).val().toString().trim() == "" ) {
                    isLoading = false;
                    $("*[datasource='" + parameters.id + "']").removeClass("loading");
                    return;
                }
                */
                var sparql = new SPARQL(parameters.url, edi.getEndpointTypes(parameters.endpointType));
                var newQuery = parameters.query.toString();
                if ( typeof parameters.searchItem !== "undefined" && $("#" + parameters.searchItem).val() != "" ) {
                    newQuery = parameters.query.toString().replace(/\$search_param\$/g, $("#" + parameters.searchItem).val()).replace(/\$search_param/g, $("#" + parameters.searchItem).val());
                }
                console.log(newQuery);
                sparql.specificQuery(newQuery, dataSuccess, dataError, language);
                break;
            default:
                isLoading = false;
                break;
        }
    }

    function filter(field, value) {
        var retVal = [];
        for ( var i = 0; i < resultSet.length; i++ ) {
            if ( resultSet[i][field].indexOf(value) >= 0 ) {
                retVal.push(resultSet[i]);
            }
        }
        return retVal;
    }

    function getId() {
        return parameters.id;
    }

    function addListener(event, callback) {
        for ( var i = 0; i < listeners.length; i++ ) {
            if ( listeners[i].event == event ) {
                listeners[i].callbacks.push(callback);
                return;
            }
        }
        listeners.push({
            event: event,
            callbacks: [callback]
        });
        console.log(listeners);
    }

    function trigger(event) {
        // console.log("triggering event " + event);
        for ( var i = 0; i < listeners.length; i++ ) {
            if ( listeners[i].event == event ) {
                // console.log(listeners[i].event);
                if ( listeners[i].callbacks ) {
                    // console.log(listeners[i].callbacks);
                    for (var j = 0; j < listeners[i].callbacks.length; j++) {
                        if ( typeof listeners[i].callbacks[j] === "function") {
                            // console.log(listeners[i].callbacks[j]);
                            listeners[i].callbacks[j](event);
                        }
                    }
                }
            }
        }
    }

    function setCurrentRow(field, value) {
        if ( parameters.singleton == "true" ) {
            // Current row only makes sense if datasource is a singleton
            currentRow = -1;
            for (var i = 0; i < resultSet.length; i++) {
                // console.log("checking " + resultSet[i][field]);
                if (resultSet[i][field] == value) {
                    currentRow = i;
                    // console.log("current row is " + i);
                    trigger("selectionChanged");
                    console.log("selectionChange event triggered with singleton datasource " + parameters.id + " and value found")
                    return;
                }
            }
            trigger("selectionChanged");
            console.log("selectionChange event triggered with singleton datasource " + parameters.id + " and value NOT found")
        }
        trigger("selectionChanged");
        console.log("selectionChange event triggered with NON singleton datasource " + parameters.id + " ")
    }

    self = {
        /**
         * Returns the id
         * @memberOf DataSource
         * @function
         */
        getId: getId,
        /**
         * @function
         * @memberOf DataSource
         * @returns {string[][]}
         */
        getResultSet: function() {
            return resultSet;
        },
        isReady: function() {
            return ( typeof resultSet !== "undefined" );
        },
        /**
         * Loads the data
         * @memberOf DataSource
         * @function
         */
        refresh: function() {
            loadData();
        },
        filter: filter,
        /**
         *
         * @memberOf DataSource
         * @param lang
         */
        setLanguage: function(lang) {
            language = lang;
        },
        /**
         *
         * @memberOf DataSource
         * @returns {string}
         */
        getLanguage: function() {
            return language;
        },
        /**
         *
         * @memberOf DataSource
         * @param callback
         */
        addListener: function(callback) {
            callbacks.push(callback);
        },
        /**
         *
         * @memberOf DataSource
         * @returns {Array}
         */
        getListeners: function() {
            return callbacks;
        },
        setCurrentRow: setCurrentRow,
        /**
         * @function
         * @memberOf DataSource
         * @returns {string[]}
         */
        getCurrentRow: function() {
            // console.log("current row is " + currentRow);
            var temp;
            if ( resultSet && currentRow != -1 ) {
                temp = resultSet[currentRow];
            } else {
                console.error("ds: " + parameters.id);
                console.error(this);
                console.error("resultSet: ");
                console.error(resultSet );
                console.error("currentRow: " + currentRow );
            }
            return temp;
        },
        /**
         *
         * @memberOf DataSource
         * @param value
         */
        setSearchItem: function(value) {
            parameters.searchItem = value;
        },

        addEventListener: addListener,
        triggerEvent: trigger,
        getUrl: function() {
            return parameters.url;
        },
        parameters: parameters
    };

    // console.log("adding self to datasourcepool");
    // console.log(self);
    DataSourcePool.getInstance().add(self);

    if ( parameters.lazy != true ) {
        loadData();
    }

    return self;
};