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
        var promises = [];
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
            var id = baseId.replace(/_Clone_[0-9]+/g, "");
            var count = 0;
            for ( var i = 0; i < datasources.length; i++ ) {
                if ( datasources[i].parameters.id.indexOf(id) == 0 ) {
                    count++;
                }
            }
            return id + "_Clone_" + count;
        }
        /**
         * @description whenAll receives an array of JQuery Promises (Deferreds) and stores them in an array.
         * When all promises are fullfilled or rejected (that is "settled"), the global Deferred returned by this function
         * is settled: resolved if all promised are fulfilled or rejected if at least one promise is rejected.
         * Both the fail and done handler of the returned value of this method are called with the following object:
         *
         *      {
    *          resolved:[{
    *                      data: {*},
    *                      textStatus: {string},
    *                      jqXHR: {jqXHR}
    *                   }],
    *          rejected:[{
    *                      jqXHR: {jqXHR},
    *                      textStatus: {string},
    *                      errorThrown: {string}
    *                   }]
    *       }
         *
         * @note the jqXHRs within out.resolved and out.rejected are the ones to inspect for myInfo.
         * @param promises
         * @returns {Deferred}
         * @note cf. http://stackoverflow.com/questions/21515643/when-apply-on-array-of-promises
         * @note This is a way to keep track of all the promises: on the contrary, JQuery.when.apply(promises).fail() does not behave the same way:
         * it fails with the first promise failure.
         */
        function whenAll(promises) {
            var i, resolved = [], rejected = [], countFinished=0 , dfd = $.Deferred();

            var oneRejected = false;

            function resolveOrReject() {
                logger.warn(countFinished);
                if (countFinished === promises.length) {
                    var out={resolved: resolved,rejected:rejected};

                    oneRejected ? dfd.reject(out) : dfd.resolve(out);
                }
            }

            // init promises done and fail handlers
            // for the done and fail args cf. https://github.com/jquery/api.jquery.com/issues/49
            // and the (following) JQuery Ajax documentation
            for (i = 0; i < promises.length; i++) {
                promises[i]
                    .done(function (data, textStatus, jqXHR) {
                        resolved.push({data:data,textStatus:textStatus,jqXHR:jqXHR});
                        jqXHR.additionalInfoFromHandler="done!";
                        countFinished++;

                        resolveOrReject();
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        oneRejected = true;

                        //console.error("one promise failed:");
                        //console.log(jqXHR.myInfo);
                        rejected.push({jqXHR:jqXHR,textStatus:textStatus,errorThrown:errorThrown});
                        countFinished++;
                        jqXHR.additionalInfoFromHandler="failed!";
                        resolveOrReject();
                    });
            }
            return dfd.promise();
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
            addPromise: function(promise) {
                promises.push(promise);
            },
            clearPromises: function() {
                promises = [];
            },
            getPromises: function() {
                return promises;
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
                if ( typeof element !== "undefined" ) {
                    for ( var i = 0; i < element.items.item.length; i++ ) {
                        if ( typeof element.items.item[i].datasource !== "undefined" && element.items.item[i].datasource != "" ) {
                            var ds = this.findById(element.items.item[i].datasource);
                            if ( ! this.isDatasourceIn(ds.parameters.id, results) ) {
                                results.push(ds);
                            }
                        }
                    }
                } else {
                    console.error("element " + element_id + " not found");
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
            generateNewId: generateNewId,
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
                logger.log("event " + event + " fired");
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
             */
            startNotifying: function () {
                notifyListeners = true;
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
                            instance.trigger("allDSRefreshed");
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
                DataSourcePool.getInstance().clearPromises();
                $("#theForm").addClass("loading");
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
                function all_success() {
                    instance.trigger("allDSRefreshed");
                }
                function some_failure() {
                    instance.trigger("allDSRefreshed");
                }
                whenAll(promises).done(all_success).fail(some_failure);
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
