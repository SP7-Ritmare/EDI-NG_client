/**
 *
 *  DataSourcePool is a Singleton hosting the pool of all application datasources
 *
 *  @author Fabio Pavesi (fabio@adamassoft.it)
 *  @class
 *
 */
var DataSourcePool = (function(){
    var instance;
    var logger = new Logger(availableContexts.DATASOURCE_POOL);

    function init() {
        var listeners = [];
        var runningDatasources = [];
        var datasources = [];
        var language = "it";
        var notifyListeners = true;

        /**
         *
         * @method
         * @memberOf DataSourcePool
         * @param item
         * @param datasource
         */
        function setDatasourceTrigger(item, datasource) {
            logger.log("setting trigger on element " + item + " for datasource " + datasource.getId());
            $("#" + item).change(function() {
                logger.log(item + " fired change towards datasource " + datasource.getId() + " current value is '" + $(this).val() + "'");

                datasource.refresh(false);
            });
        }

        /**
         * @method
         * @memberOf DataSourcePool
         * @param baseId
         * @returns {string}
         */
        function generateNewId(baseId) {
            var count = 0;
            for ( var i = 0; i < datasources.length; i++ ) {
                if ( datasources[i].parameters.id.indexOf(baseId) == 0 ) {
                    count++;
                }
            }
            return baseId + "_Clone_" + count;
        }
        return {
            setDatasourceTrigger: setDatasourceTrigger,
            /**
             * @method
             * @memberOf DataSourcePool
             * @param lang
             */
            setLanguage: function(lang) {
                language = lang;
                for ( var i = 0; i < datasources.length; i++ ) {
                    datasources[i].setLanguage(lang);
                }
            },
            /**
             * Adds a DataSource to pool
             * @memberOf DataSourcePool
             * @param ds
             */
            add: function(ds) {
                // logger.log("adding datasource");
                // logger.log(ds);
                ds.setLanguage(language);
                datasources.push(ds);
            },
            /**
             * Remove DataSource by id
             *
             * @memberOf DataSourcePool
             * @param id
             */
            remove: function(id) {
                for ( var i = 0; i < datasources.length; i++ ) {
                    if ( datasources[i].getId() == id ) {
                        datasources.splice(i, 1);
                    }
                }
            },
            /**
             *
             * @param id
             * @memberOf DataSourcePool
             * @returns {DataSource}
             */
            findById: function(id) {
                for ( var i = 0; i < datasources.length; i++ ) {
                    if ( datasources[i].getId() == id ) {
                        return datasources[i];
                    }
                }
                return undefined;
            },
            /**
             * Find all datasources that are triggered by some Item belonging to an Element
             * Element is identified by its id
             *
             * @memberOf DataSourcePool
             * @param {int} element_id - element's id
             * @returns {DataSource[]}
             */
            findByTriggeredItemInElement: function (element_id) {
                var results = [];
                var found;
                for ( var i = 0; i < datasources.length; i++ ) {
                    if ( datasources[i].parameters.triggerItem && datasources[i].parameters.triggerItem.indexOf(element_id) == 0 ) {
                        found = false;
                        for ( var j = 0; j < results.length; j++ ) {
                            if ( results[j].parameters.id == datasources[i].parameters.id ) {
                                found = true;
                            }
                        }
                        if ( !found ) {
                            results.push(datasources[i]);
                        }
                    }
                }
                logger.log(results);
                return results;
            },
            isDatasourceIn: function(ds_id, array) {
                for ( var i = 0; i < array.length; i++ ) {
                    if ( array[i].parameters.id == ds_id ) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Finds all DataSource referred to by Items in a specific Element
             *
             * @memberOf DataSourcePool
             * @param element_id
             * @returns {Array}
             */
            findByElementId: function(element_id) {
                var results = [];
                var element = ediml.getElement(element_id);
                for ( var i = 0; i < element.items.item.length; i++ ) {
                    if ( typeof element.items.item[i].datasource !== "undefined" && element.items.item[i].datasource != "" ) {
                        var ds = this.findById(element.items.item[i].datasource);
                        if ( ! this.isDatasourceIn(ds.parameters.id, results) ) {
                            results.push(ds);
                        }
                    }
                }
                return results;
            },
            /**
             * Duplicates a DataSource
             *
             * @method
             * @memberOf DataSourcePool
             * @param id
             * @param newTriggerItem - name of the trigger item in the new data source
             * @param newSearchItem - name of the search item in the new data source
             * @returns {DataSource}
             */
            duplicateDatasource: function duplicate(id, newTriggerItem, newSearchItem) {
                var newId = generateNewId(id);
                var ds = DataSourcePool.getInstance().findById(id);
                var newPars = clone(ds.parameters);
                newPars.id = newId;
                newPars.triggerItem = newTriggerItem;
                newPars.searchItem = newSearchItem;
                newPars.cloned = true;
                logger.log("duplicating ds " + id + " as " + newId);
                logger.log("triggerItem: " + newTriggerItem);
                logger.log("searchItem: " + newSearchItem);
                var newDs = new DataSource(newPars);
                if ( newTriggerItem ) {
                    setDatasourceTrigger(newTriggerItem, newDs);
                }
                return newDs;
            },
            /**
             *
             * @memberOf DataSourcePool
             * @returns {Array}
             */
            getListeners: function() {
                return listeners;
            },
            /**
             *
             * @memberOf DataSourcePool
             * @param event
             * @param callback
             */
            addListener: function(event, callback) {
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
                // logger.log(listeners);
            },
            /**
             *
             * @memberOf DataSourcePool
             * @param event
             */
            trigger: function (event) {
                if ( ! notifyListeners ) {
                    return;
                }
                // logger.log("triggering event " + event);
                for ( var i = 0; i < listeners.length; i++ ) {
                    if ( listeners[i].event == event ) {
                        // logger.log(listeners[i].event);
                        if ( listeners[i].callbacks ) {
                            // logger.log(listeners[i].callbacks);
                            for (var j = 0; j < listeners[i].callbacks.length; j++) {
                                if ( typeof listeners[i].callbacks[j] === "function") {
                                    // logger.log(listeners[i].callbacks[j]);
                                    listeners[i].callbacks[j](event);
                                }
                            }
                        }
                    }
                }
            },
            /**
             *
             * @memberOf DataSourcePool
             */
            stopNotifying: function() {
                notifyListeners = false;
            },
            /**
             *
             * @memberOf DataSourcePool
             * @param ds
             */
            queryStart: function(ds) {
                runningDatasources.push(ds);
            },
            /**
             *
             * @memberOf DataSourcePool
             * @param ds
             */
            queryEnd: function(ds) {
                // logger.log("removing datasource " + ds.getId());
                for ( var i = 0; i < runningDatasources.length; i++ ) {
                    if ( runningDatasources[i] == ds ) {
                        runningDatasources.splice(i, 1);
                        if ( runningDatasources.length == 0 ) {
                            logger.log("allReady");
                            instance.trigger("allReady");
                        }
                        return;
                    }
                }
            },
            /**
             * Returns all datasources
             *
             * @memberOf DataSourcePool
             * @deprecated
             * @see getDataSources
             * @returns {DataSource[]}
             */
            datasources: function() {
                return datasources;
            },
            /**
             * Returns all datasources
             * @method getDataSources
             * @memberOf DataSourcePool
             * @returns {DataSource[]}
             */
            getDataSources: function() {
                return datasources;
            },
            /**
             *
             * @memberOf DataSourcePool
             */
            refreshAll: function() {
                for ( var i = 0; i < datasources.length; i++ ) {
                    var ds = datasources[i];
                    if ( typeof ds.parameters.triggerItem !== "undefined" ) {
                        logger.log("datasource " + ds.parameters.id + " depends on trigger " + ds.parameters.triggerItem);
                        logger.log("trigger item has " + $("#" + ds.parameters.triggerItem).length + " occurrences");
                        setDatasourceTrigger(ds.parameters.triggerItem, ds);
                        /*
                         $("#" + ds.parameters.triggerItem).change(function() {
                         logger.log($(this).attr("id") + " fired change towards datasource " + ds.getId() + " - " + i);

                         ds.refresh(false);
                         });
                         */
                    }


                    ds.refresh(true);
                }
                for ( var i = 0; i < datasources.length; i++ ) {
                    var ds = datasources[i];
                    ds.refresh(false);
                }
            }
        };
    }
    return {
        /**
         *
         * @memberOf DataSourcePool
         * @returns {*}
         */
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }

            return instance;
        }
    }
})();
