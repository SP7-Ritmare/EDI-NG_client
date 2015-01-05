var DataSourcePool = (function(){
    var instance;
    function init() {
        var listeners = [];
        var runningDatasources = [];
        var datasources = [];
        var language = "it";
        var notifyListeners = true;

        function setDatasourceTrigger(elementId, datasource) {
            $("#" + elementId).change(function() {
                console.log(elementId + " fired change towards datasource " + datasource.getId());

                datasource.refresh(false);
            });
        }
        return {
            setLanguage: function(lang) {
                language = lang;
                for ( var i = 0; i < datasources.length; i++ ) {
                    datasources[i].setLanguage(lang);
                }
            },
            add: function(ds) {
                // console.log("adding datasource");
                // console.log(ds);
                ds.setLanguage(language);
                datasources.push(ds);
            },
            remove: function(id) {
                for ( var i = 0; i < datasources.length; i++ ) {
                    if ( datasources[i].getId() == id ) {
                        datasources.splice(i, 1);
                    }
                }
            },
            findById: function(id) {
                for ( var i = 0; i < datasources.length; i++ ) {
                    if ( datasources[i].getId() == id ) {
                        return datasources[i];
                    }
                }
                return undefined;
            },
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
                console.log(results);
                return results;
            },
            duplicateDatasource: function duplicate(id, newId, newTriggerItem, newSearchItem) {
                var ds = DataSourcePool.getInstance().findById(id);
                var newPars = clone(ds.parameters);
                newPars.id = newId;
                newPars.triggerItem = newTriggerItem;
                newPars.searchItem = newSearchItem;
                var newDs = new DataSource(newPars);
                setDatasourceTrigger(newTriggerItem, newDs);
                return newDs;
            },
            getListeners: function() {
                return listeners;
            },
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
                // console.log(listeners);
            },
            trigger: function (event) {
                if ( ! notifyListeners ) {
                    return;
                }
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
            },
            stopNotifying: function() {
                notifyListeners = false;
            },
            queryStart: function(ds) {
                runningDatasources.push(ds);
            },
            queryEnd: function(ds) {
                // console.log("removing datasource " + ds.getId());
                for ( var i = 0; i < runningDatasources.length; i++ ) {
                    if ( runningDatasources[i] == ds ) {
                        runningDatasources.splice(i, 1);
                        if ( runningDatasources.length == 0 ) {
                            console.log("allReady");
                            instance.trigger("allReady");
                        }
                        return;
                    }
                }
            },
            datasources: function() {
                return datasources;
            },
            refreshAll: function() {
                for ( var i = 0; i < datasources.length; i++ ) {
                    var ds = datasources[i];
                    if ( typeof ds.parameters.triggerItem !== "undefined" ) {
                        console.log("datasource " + ds.parameters.id + " depends on trigger " + ds.parameters.triggerItem);
                        console.log("trigger item has " + $("#" + ds.parameters.triggerItem).length + " occurrences");
                        setDatasourceTrigger(ds.parameters.triggerItem, ds);
                        /*
                         $("#" + ds.parameters.triggerItem).change(function() {
                         console.log($(this).attr("id") + " fired change towards datasource " + ds.getId() + " - " + i);

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
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }

            return instance;
        }
    }
})();
