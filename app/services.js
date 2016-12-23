/**
 * Created by fabio on 18/11/2016.
 */
angular.module("app.services", [])
    .factory("XML", function () {
        var service = {
            xml2json: function (xml) {
                // console.log("xml2json");
                // console.log(typeof xml);
                // console.log(xml);
                var x2j = new X2JS();
                var json = x2j.xml_str2json(xml);
                return json;
            },
            json2xml: function (json) {
                var x2js = new X2JS();
                var xml = /* '<?xml version="1.0" encoding="UTF-8"?>' + */ (x2js.json2xml_str(json));
                return xml;
            }
        };

        return service;
    })
    .factory("EDIML", function ($http, $q) {
        var service = {
            ediml: {},
            getItem: function (id) {
                logger.log("searching for item " + id);
                for (var i = 0; i < ediml.content.elements.element.length; i++) {
                    var element = ediml.content.elements.element[i];
                    for (var j = 0; j < element.items.item.length; j++) {
                        var item = element.items.item[j];
                        if (item.id == id) {
                            logger.log("found");
                            logger.log(item);
                            return item;
                        }
                    }
                }
                logger.log("item " + id + " not found");
            }
        };

        return service;
    })
    .factory("Templates", function ($http, $q, XML, EDIML, Datasources) {
        var baseDir = "bower_components/EDI-NG_templates/templates/";
        var endpointTypes;
        var theTemplate;
        var dataSources = [];
        var settings;

        function compileItem(item, element) {
            var id = element.id + "_" + item.hasIndex;
            item.showType = ItemRenderer.getRenderer(item);
            var tempStructure = [];
            tempStructure[id] = {};
            tempStructure[id].item = item;
            tempStructure[id].item.id = id;
            tempStructure[id].element = element;

            if (item.label) {
                if (!$.isArray(item.label)) {
                    item.label = [item.label];
                }
                if (item.help) {
                    if (!$.isArray(item.help)) {
                        item.help = [item.help];
                    }
                    logger.log(item.help);
                }
            }
            element.items.item.push(item);
        }

        function compileElement(element, groupId) {
            var theElement = new Element();
            theElement.id = element.id;
            theElement.mandatory = element.isMandatory;
            theElement.multiple = element.isMultiple;
            theElement.root = element.hasRoot;
            theElement.represents_element = element.id;
            theElement.alternativeTo = element.alternativeTo;
            theElement.group = groupId;
            theElement.label = element.label;
            theElement.help = element.help;
            var atLeastOneEditableItem = false;
            for (var i = 0; i < element.produces.item.length; i++) {
                if (element.produces.item[i].isFixed == "false") {
                    atLeastOneEditableItem = true;
                }
                compileItem(element.produces.item[i], theElement);
            }
            theElement.visible = atLeastOneEditableItem;
            ediml.addElement(theElement);
        }

        function compileGroup(group) {
            for (var j = 0; j < group.element.length; j++) {
                var element = group.element[j];
                compileElement(group.element[j], group.id);
            }
        }

        function onTemplateLoaded(template, version, data) {
            console.log("onTemplateLoaded");
            settings = data.settings;
            console.log("default language: " + data.settings.defaultLanguage);
            console.log("default language: " + reverseLookupLanguage(data.settings.defaultLanguage));
            // angular.copy(reverseLookupLanguage(data.settings.defaultLanguage), Datasources.metadataLanguage);
            Datasources.metadataLanguage = reverseLookupLanguage(data.settings.defaultLanguage);
            /*
             $scope.templateVersion = template + " v" + version;
             $scope.pageTitle = template + " v" + version;
             */

            data = fixOneItemArrays(data);
            theTemplate = data;

            endpointTypes = {};
            logger.log("endpoints");
            if (data.endpointTypes) {
                if (!$.isArray(data.endpointTypes.endpointType)) {
                    data.endpointTypes.endpointType = [data.endpointTypes.endpointType];
                }

                for (var i = 0; i < data.endpointTypes.endpointType.length; i++) {
                    var e = data.endpointTypes.endpointType[i];
                    logger.log(e);
                    var endpointType = new EndpointType(e);
                    logger.log(endpointType);
                    endpointTypes[e.id] = endpointType;
                }
            }
            logger.log("endpoints end");
            angular.copy(endpointTypes, Datasources.endpointTypes);

            if (data.datasources) {
                var dss = data.datasources.datasource;
                for (var i = 0; i < dss.length; i++) {
                    logger.log(dss[i]);
                    var ds = new DataSource({
                        id: dss[i].id,
                        type: dss[i].type,
                        uri: dss[i].uri,
                        url: ( dss[i].url ? dss[i].url : settings.sparqlEndpoint),
                        endpointType: dss[i].endpointType,
                        query: dss[i].query,
                        searchItem: dss[i].searchItem,
                        triggerItem: dss[i].triggerItem,
                        singleton: dss[i].singleton,
                        ready: function (data) {
                            // logger.log("ds callback success");
                            // logger.log(data);
                        }
                    });
                    logger.log("Adding datasource " + ds.getId());
                    ds.instanceNumber++;
                    dataSources.push(ds);
                    // Datasources.datasourceInstances.push(ds);
                }
            }

            for (var i = 0; i < dataSources.length; i++) {
                dataSources[i].parameters.endpointType = endpointTypes[dataSources[i].parameters.endpointType];
            }
            angular.copy(dataSources, Datasources.datasources);

            var groups = data.group;
            if (!$.isArray(groups)) {
                groups = [groups];
            }
            // form = $("#theForm").append("<div>").children("div");
            ediml.inheritSettings(settings);
            ediml.content.elements.template = template;
            ediml.content.elements.version = version;
            ediml.content.elements.template = data;
            for (var i = 0; i < groups.length; i++) {
                compileGroup(groups[i]);
            }
            angular.copy(ediml, EDIML.ediml);
        }

        function fixOneItemArrays(data) {
            // XML arrays with one item will be converted, in JSON, to plain objects
            // we need to fix this
            var $ = angular;

            console.log(data);
            if (!$.isArray(data.group)) {
                data.group = [data.group];
            }
            for (var i = 0; i < data.group.length; i++) {
                console.log(111);
                console.log(data.group[i]);
                if (!$.isArray(data.group[i].element)) {
                    data.group[i].element = [data.group[i].element];
                }
                for (var j = 0; j < data.group[i].element.length; j++) {
                    if (data.group[i].element[j].produces) {
                        if (!$.isArray(data.group[i].element[j].produces.item)) {
                            data.group[i].element[j].produces.item = [data.group[i].element[j].produces.item];
                        }
                    }
                }
            }
            return data;
        }

        var service = {
            load: function (templateName, templateVersion) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: baseDir + templateName + "_v" + templateVersion + ".xml",
                    timeout: 10000,
                    params: {},  // Query Parameters (GET)
                    transformResponse: function (data) {
                        // string -> XML document object
                        return $.parseXML(data);
                    }
                }).success(function (data, status, headers, config) {
                    // console.log(data);
                    var res = XML.xml2json(data.documentElement.outerHTML);
                    // fixOneItemArrays(res.template);

                    onTemplateLoaded(templateName, templateVersion, res.template);

                    console.log(ediml);
                    Datasources.refreshAll();
                    // console.log(res);  // XML document object
                    deferred.resolve(res);
                }).error(function (data, status, headers, config) {
                    $window.alert('Errore');
                    deferred.reject(data);
                });

                return deferred.promise;
            }
        };

        return service;
    })
    .factory("Datasources", function ($http, $q, EDIML) {
        var service = {
            metadataLanguage: "---",
            endpointTypes: {},
            datasources: [],
            datasourceInstances: [],
            setMetadataLanguage: function (lang) {
                service.metadataLanguage = lang;
            },
            find: function (itemId, id) {
                for (var i = 0; i < service.datasourceInstances.length; i++) {
                    var ds = service.datasourceInstances[i];
                    if (ds.parameters.id == id && ds.owningItem == itemId) {
                        // console.log("found " + ds);
                        return ds;
                    }
                }
                console.log("datasource " + id + " not found for item " + itemId);
                var baseDs = service.findBase(id);
                if ( baseDs ) {
                    var ds = clone(baseDs);
                    ds.owningItem = itemId;
                    ds.resultSet = [];
                    service.refresh(ds);
                    service.datasourceInstances.push(ds);
                    return ds;
                } else {
                    console.log("base datasource not found: " + id);
                }
            },
            findBase: function (id) {
                for (var i = 0; i < service.datasources.length; i++) {
                    var ds = service.datasources[i];
                    if (ds.parameters.id == id) {
                        // console.log("found " + ds);
                        return ds;
                    }
                }
            },
            refresh: function (ds) {
                function escapeSearchItem(ds, item) {
                    logger.log("searchItem for " + ds.parameters.id);
                    logger.log(item);
                    if (typeof item !== "undefined" && item != null) {
                        var returnValue = item;
                        returnValue = returnValue
                            .replace(/\(/g, "\\\\(")
                            .replace(/\)/g, "\\\\)");
                        return returnValue;
                    } else {
                        logger.error("searchItem is null in datasource " + ds.parameters.id);
                        return item;
                    }
                }

                switch (ds.parameters.type) {
                    case DataSourceType.virtuosoCodelist:
                        var sparql = new SPARQL(ds.parameters.url, ds.parameters.endpointType);
                        // logger.log("load data for " + parameters.id);
                        // console.log(sparql.getSparqlQuery(ds.parameters.uri, service.metadataLanguage));
                        var params = {};
                        var headers = {};
                        params[ds.parameters.endpointType.parameters.queryParameter] = sparql.getSparqlQuery(ds.parameters.uri, lookupLanguage(service.metadataLanguage));
                        console.log("query: " + params[ds.parameters.endpointType.parameters.queryParameter]);
                        for (var p in ds.parameters.endpointType.parameters.parameters) {
                            params[p] = ds.parameters.endpointType.parameters.parameters[p];
                        }
                        if (ds.parameters.endpointType.parameters.contentType.json) {
//                            headers["Accepts"] = ds.parameters.endpointType.parameters.contentType.json;
                        }
                        $http({
                            url: ds.parameters.url,
                            method: ds.parameters.endpointType.parameters.method,
                            params: params,
                            headers: headers
                        }).then(function (res) {
                            if (typeof ds.parameters.adapter === "undefined" && ds.parameters.type == DataSourceType.virtuosoCodelist || ds.parameters.type == DataSourceType.sparql) {
                                ds.parameters.adapter = adapters.sparql;
                            }
                            if (typeof ds.parameters.adapter !== "undefined") {
                                ds.resultSet = ds.parameters.adapter(res.data);
                            }
                            console.log("results for datasource " + ds.parameters.id + " in " + service.metadataLanguage);
                            console.log(ds.resultSet);
                        });
                        switch (ds.parameters.endpointType.parameters.method) {
                            case "GET":

                                break;
                            case "POST":
                                break;
                            default:
                        }
                        /*
                         var jqXHR = sparql.query(parameters.uri, dataSuccess, dataError, language);
                         DataSourcePool.getInstance().addPromise(jqXHR);
                         */
                        break;
                    case DataSourceType.sparql:
                        if (typeof ds.parameters.triggerItem !== "undefined") {
                            logger.log(ds.parameters.id + " is a datasource triggered by " + ds.parameters.triggerItem);
                            ds.parameters.searchItem = ds.parameters.triggerItem;
                        }
                        /*
                         if ( typeof parameters.searchItem === "undefined" || typeof $("#" + parameters.searchItem) === "undefined" || $("#" + parameters.searchItem).val().toString().trim() == "" ) {
                         isLoading = false;
                         $("*[datasource='" + parameters.id + "']").removeClass("loading");
                         return;
                         }
                         */
                        var sparql = new SPARQL(ds.parameters.url, ds.parameters.endpointType);
                        var newQuery = ds.parameters.query.toString();
                        console.log(EDIML.getItem(ds.parameters.searchItem));

                        var searchItem = EDIML.getItem(ds.parameters.searchItem);
                        if (typeof searchItem !== "undefined" && searchItem.value) {
                            if (searchItem) {
                                throw "Datasource '" + ds.parameters.id + "': search item '" + ds.parameters.searchItem + "' does not exist";
                            }

                            newQuery = ds.parameters.query.toString().replace(/\$search_param\$/g, escapeSearchItem(ds, searchItem.value)).replace(/\$search_param/g, escapeSearchItem(ds, searchItem.value));
                        }
                        logger.log(newQuery);
                        var params = {};
                        var headers = {};
                        params[ds.parameters.endpointType.parameters.queryParameter] = newQuery;
                        for (var p in ds.parameters.endpointType.parameters.parameters) {
                            params[p] = ds.parameters.endpointType.parameters.parameters[p];
                        }
                        if (ds.parameters.endpointType.parameters.contentType.json) {
//                            headers["Accepts"] = ds.parameters.endpointType.parameters.contentType.json;
                        }
                        $http({
                            url: ds.parameters.url,
                            method: ds.parameters.endpointType.parameters.method,
                            params: params,
                            headers: headers
                        }).then(function (res) {
                            console.log(res);
                            if (typeof ds.parameters.adapter === "undefined" && ds.parameters.type == DataSourceType.virtuosoCodelist || ds.parameters.type == DataSourceType.sparql) {
                                ds.parameters.adapter = adapters.sparql;
                            }
                            if (typeof ds.parameters.adapter !== "undefined") {
                                ds.resultSet = ds.parameters.adapter(res.data);
                            }

                        });
                        switch (ds.parameters.endpointType.parameters.method) {
                            case "GET":

                                break;
                            case "POST":
                                break;
                            default:
                        }

                        /*
                         var jqXHR = sparql.specificQuery(newQuery, dataSuccess, dataError, language);
                         DataSourcePool.getInstance().addPromise(jqXHR);
                         */
                        break;
                    default:
                        isLoading = false;
                        break;
                }

            },
            refreshAll: function () {
                for (var i = 0; i < service.datasourceInstances.length; i++) {
                    var ds = service.datasourceInstances[i];
                    service.refresh(ds);
                }
            },
            getData: function (id, name) {
                var ds = service.find(id, name);
                if (ds) {
                    return ds.resultSet;
                }
            }
        };

        return service;
    })
    .directive('ediGroup', function () {
        return {
            transclude: false,
            link: function (scope, element, attrs) {
                // some ode
            },
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || 'components/renderers/group.html'
            }
            // templateUrl: 'components/renderers/group.html'
        };
    })
    .directive('ediElement', function () {
        return {
            transclude: false,
            link: function (scope, element, attrs) {
                // some ode
            },
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || 'components/renderers/element.html'
            }
            // templateUrl: 'components/renderers/group.html'
        };
    })
    .directive('ediItem', function () {
        return {
            transclude: true,
            replace: true,
            link: function (scope, element, attrs) {
                // some ode
                console.log(11);
                console.log(scope.i);
                console.log(attrs);
                if (scope.i.hasDatatype == "string" && scope.i.isFixed == "false") {
                    console.log(123);
                    attrs.templateUrl = "components/renderers/string.html";
                }
            },
            templateUrl: function (elem, attrs) {
                console.log(22);
                console.log(elem);
                console.log(attrs);
                /*
                 if ( attrs.isfixed == false && attrs.hasdatatype == "string" ) {
                 return "components/renderers/string.html";
                 }
                 */
                console.log(attrs.templateUrl);
                console.log("template is " + attrs.templateUrl || 'components/renderers/item.html');
                return attrs.templateUrl || 'components/renderers/item.html';
            }
            // templateUrl: 'components/renderers/group.html'
        };
    })

;