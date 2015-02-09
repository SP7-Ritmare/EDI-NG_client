/**
 *
 * This module represents EDIML's lifecycle
 * The 'content' attribute represents the actual core.
 * The weird structure of the 'content' object is a trade off needed to allow this structure to exchange data in XML form compatible with both the xml2json.js/json2xml.js conversions and JAXB's server side conversion.
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 *
 */



var ediml = (function() {
    var metadataEndpoint;
    var settings;
    var edimls = {};

    var content = {
        elements: {
            ediVersion: 2.0,
            version: undefined,
            template: undefined,
            fileId: undefined,
            fileUri: undefined,
            user: undefined,
            baseDocument: undefined,
            xsltChain: undefined,
            element: []
        }
    };

    function doDebug(msg) {
        console.log(msg);
    }

    function inheritSettings(newSettings) {
        settings = newSettings;
        metadataEndpoint = settings.metadataEndpoint;
        if ( typeof metadataEndpoint === "undefined" ) {
            metadataEndpoint = defaults.metadataEndpoint;
        }
        if ( typeof settings.baseDocument !== "undefined" ) {
            content.elements.baseDocument = settings.baseDocument;
        }
        if ( typeof settings.xsltChain !== "undefined" ) {
            content.elements.xsltChain = settings.xsltChain;
        }
    }

    var defaultPostErrorCallback = function() {
        // var newWindow2 = window.open("data:text/xml," + encodeURIComponent(arguments.responseText),"_blank");
        // doDebug('Failed ' + JSON.stringify(arguments));
        $("#mdcontent").prepend("<pre class='prettypring lang-json'>" + JSON.stringify(arguments, undefined, 2) + "</pre>");
        prettyPrint();

        console.log(arguments);
    };

    var defaultPostSuccessCallback = function(msg){
        // $( "#debug" ).html( htmlEncode(msg) );
        // doDebug("Ricevuto: " + xmlToString(msg));
        console.log(msg);
        if ( msg.responseCode == 200 ) {
            edi.setGeneratedXml(msg.generatedXml);
            alert("your XML has been correctly generated");
            var xmlString = msg.generatedXml;
            if ( false && xmlString.indexOf("sml:SensorML") >= 0 ) {
                xmlString = formatXml(xmlString);
                $("#mdcontent").prepend("<pre class='prettyprint lang-html linenums:1'>" + xmlString.encodeHTML() + "</pre>");
                prettyPrint();

                $.ajax({
                    type     : "POST",
                    url      : "sos/registerSensor",
                    contentType: "application/xml",
                    processData: true,
                    data     : (xmlString),
                    success  : function(msg){
                        // $( "#debug" ).html( htmlEncode(msg) );
                        // doDebug("Ricevuto: " + xmlToString(msg));
                        var xmlString = xmlToString(msg);
                        var newWindow = window.open("data:text/xml," + encodeURIComponent(xmlString),"_blank");
                        $.ajax({
                            type     : "POST",
                            url      : "http://sp7.irea.cnr.it/sigosos/SOS32/sos",
                            contentType: "application/xml",
                            processData: true,
                            data     : (xmlString),
                            success  : function(msg){
                                // $( "#debug" ).html( htmlEncode(msg) );
                                // doDebug("Ricevuto: " + xmlToString(msg));
                                var xmlString = xmlToString(msg);
                                var newWindow = window.open("data:text/xml," + encodeURIComponent(xmlString),"_blank");
                                /*
                                 newWindow.document.open();
                                 newWindow.document.write(xmlToString(msg));
                                 newWindow.document.close();
                                 */
                            },
                            error    : function() {
                                var newWindow2 = window.open("data:text/xml," + encodeURIComponent(arguments.responseText),"_blank");
                                // doDebug('Failed ' + JSON.stringify(arguments));
                            }
                        });
                        /*
                         newWindow.document.open();
                         newWindow.document.write(xmlToString(msg));
                         newWindow.document.close();
                         */
                    },
                    error    : function() {
                        var newWindow2 = window.open("data:text/xml," + encodeURIComponent(arguments.responseText),"_blank");
                        doDebug('Failed ' + JSON.stringify(arguments));
                    }
                });
            } else {
                xmlString = formatXml(xmlString);
                $("#mdcontent").prepend("<pre class='prettyprint lang-html linenums:1'>" + xmlString.encodeHTML() + "</pre>");
                $("#mdcontent").prepend("<pre class='prettyprint lang-json'>" + JSON.stringify(msg, undefined, 2) + "</pre>");
                prettyPrint();
                // prettyPrintOne('<root><node1><root>', 'xml')
            }
            /*
             newWindow.document.open();
             newWindow.document.write(xmlToString(msg));
             newWindow.document.close();
             */
        } else {

            $("#mdcontent").prepend("<pre class='prettyprint lang-json'>" + JSON.stringify(msg, undefined, 2) + "</pre>");
            prettyPrint();
        }
        $("#MDDownload").show();
    };

    function post() {
        $("#MDDownload").hide();

        if ( settings.requiresValidation == "true" ) {
            if ( !validator.validate() ) {
                alert(validator.getErrorCount() + " errors, " + validator.getWarningCount() + " warnings");
                return;
            }
            if ( validator.getWarningCount() > 0 && !$("#ignoreWarnings").prop("checked") ) {
                alert(validator.getWarningCount() + " warnings");
                return;
            }
        }
        var postMetadata = function(data) {
            edi.setGeneratedXml(undefined);

            content.elements.fileId = data.id;
            content.elements.fileUri = metadataEndpoint + "rest/ediml/" + data.uri;
            xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
            if ( typeof successCallback == 'undefined' ) {
                successCallback = defaultPostSuccessCallback;
            }
            if ( typeof errorCallback == 'undefined' ) {
                errorCallback = defaultPostErrorCallback;
            }

            var x2js = new X2JS();
            var xml = /* '<?xml version="1.0" encoding="UTF-8"?>' + */ (x2js.json2xml_str(content));
            if ( querystring("debug") == "on" ) {
                //    var newWindow1 = window.open("data:text/xml," + encodeURIComponent(xml),"_blank");
                // $("#mdcontent").prepend("<pre class='prettyprint lang-json'>" + JSON.stringify(content, undefined, 4) + "</pre>");
                $("#mdcontent").prepend("<pre class='prettyprint lang-html linenums:1'>" + formatXml(xml).encodeHTML() + "</pre>");
                prettyPrint();
            }


            $.ajax({
                type     : "POST",
                url      : metadataEndpoint + "rest/metadata",
                dataType : "json",
                contentType: "application/xml",
                processData: true,
                data	 : (xml),
                success  : successCallback,
                error    : errorCallback
            });
        }
        if ( content.elements.fileId /*querystring("edit")*/ ) {
            postMetadata({ id: content.elements.fileId, uri: metadataEndpoint + "rest/ediml/" + content.elements.fileId });
        } else {
            $.ajax({
                type     : "GET",
                url      : metadataEndpoint + "rest/ediml/requestId",
                contentType: "application/json",
                processData: true,
                success  : postMetadata,
                error    : function() {
                    alert("error on " + metadataEndpoint + "rest/ediml/requestId");
                    console.log(arguments);
                }
            });
        }    }

    /**
     * Loads EDIML from the metadataEndpoint defined in the template's settings
     * @param edimlId   the EDIML record to be fetched
     * @param callback  who to call when done
     */
    function loadEDIML(edimlId, callback) {
        if ( typeof edimlId === "undefined" || edimlId == "" ) {
            return;
        }
        $.ajax( {
            url: metadataEndpoint + "rest/ediml/" + edimlId,
            dataType: "xml",
            success: function( data ) {
                var x2j = new X2JS();
                var json = x2j.xml2json(data);
                console.log(json);

                for ( var i = 0; i < json.elements.element.length; i++ ) {

                }
                callback(json.elements);
            }
        });
    };

    function fixJSONDiscrepancies() {
        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            if ( $.isArray(element.items) ) {
                var temp = element.items;
                element.items = {};
                element.items.item = temp;
            }

        }
    }

    /**
     * Load EDIML from localStorage (if available)
     *
     * @param name  name the EDIML was saved as
     */
    function load(name) {
        if(typeof(Storage) !== "undefined") {
            console.log(localStorage.edimls);
            if ( typeof localStorage.edimls !== "undefined" ) {
                edimls = JSON.parse(localStorage.edimls);
                console.log(edimls[name]);
                fillInEdiMl(edimls[name].ediml.elements);
                setTimeout( function() {
                    DataSourcePool.getInstance().refreshAll();
                }, 5);

            }
        } else {
            // Sorry! No Web Storage support..
        }
    }

    /**
     * Saves current EDIML state to localStorage
     * WARNING: the EDIML is saved as is, with no validation
     *
     * @param name  name to be assigned to this instance
     */
    function saveAs(name) {
        var data = {
            ediml: content,
            date: new Date()
        };

        if(typeof(Storage) !== "undefined") {
            edimls[name] = data;
            localStorage.edimls = JSON.stringify(edimls);
            console.log(localStorage.edimls);
            console.log(edimls);
        } else {
            // Sorry! No Web Storage support..
        }
    }

    function downloadMetadata() {
        var newWindow1 = window.open("data:text/xml," + encodeURIComponent(edi.getGeneratedXml()),"_blank");
    }
    /**
     * Fills in the HTML form with contents of the EDIML parameter
     *
     * @param ediMl
     */
    function fillInEdiMl(ediMl) {
        var element;
        var item;
        var cloneSuffix = edi.cloneSuffix;
        console.log("ediml caricato:");
        console.log(ediMl);
        content.elements.fileId = ediMl.fileId;
        content.elements.fileUri = ediMl.fileUri;
        content.elements.template = ediMl.templateName;
        content.elements.version = ediMl.version;
        content.elements.ediVersion = defaults.ediVersion;
        content.elements.starterKitUri = ediMl.starterKitUri;
        content.elements.element = ediMl.element;
        content.elements.baseDocument = ediMl.baseDocument;
        fixJSONDiscrepancies();

        doDebug(content.elements);
        var elements = content.elements;
        for ( var i = 0; i < elements.element.length; i++ ) {
            element = elements.element[i];
            if ( element.id.indexOf(cloneSuffix) == -1 ) {
                doDebug(element);
                for ( var j = 0; element.items.item && j < element.items.item.length; j++ ) {
                    item = element.items.item[j];
                    var newItem = new Item();
                    for ( var key in item ) {
                        newItem[key] = item[key];
                    }
                    element.items.item[j] = newItem;
                    item = element.items.item[j];

                    // doDebug(item);
                    if ( typeof item.datatype === "undefined" && typeof item.dataType !== "undefined" ) {
                        item.datatype = item.dataType;
                    }
                    if ( item.datatype == "codelist" || item.datatype == "query" ) {
                        $("#" + item.id).val(item.codeValue).trigger("change");
                    } else if ( item.datatype == "autoCompletion" ) {
                        $("#" + item.id).val(item.value).trigger("change");
                        $("#" + item.id + "_uri").val(item.codeValue);
                        $("#" + item.id + "_urn").val(item.urnValue);
                    } else {
                        $("#" + item.id).val(item.value).trigger("change");
                    }
                }
            } else {
                var represents_element = element.id.replaceAll(cloneSuffix, "");
                edi.duplicateElement(represents_element, element.id, false);
                for ( var j = 0; element.items.item && j < element.items.item.length; j++ ) {
                    item = element.items.item[j];
                    var newItem = new Item();
                    for ( var key in item ) {
                        newItem[key] = item[key];
                    }
                    element.items.item[j] = newItem;
                    item = element.items.item[j];

//                    doDebug(item);
                    if ( item.datatype == "codelist" || item.datatype == "query" ) {
                        $("#" + item.id).val(item.codeValue);
                    } else if ( item.datatype == "autoCompletion" ) {
                        $("#" + item.id).val(item.value);
                        $("#" + item.id + "_uri").val(item.codeValue);
                        $("#" + item.id + "_urn").val(item.urnValue);
                    } else {
                        $("#" + item.id).val(item.value);
                    }
                }
            }
        }
        $("select[languageselector='true']").trigger('change');
        // updateAll();
    };


    function indexOfLastInstanceOf(id) {
        var found = false;

        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            if ( element.id == id ) {
                found = true;
            }
            if ( found && element.represents_element != id ) {
                return i;
            }
        }
        if ( found ) {
            return content.elements.element.length - 1;
        } else {
            throw "Element " + id + " is not present";
        }
    }

    function addElement(element) {
        content.elements.element.push(element);
    }

    function removeElement(element_id) {
        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            if ( element.id == element_id ) {
                content.elements.element.splice(i, 1);
                return;
            }
        }
    }

    function getElement(id) {
        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            if ( element.id == id ) {
                return element;
            }
        }
        return undefined;
    }

    /**
     * Duplicates an EDIML element, but not its HTML representation
     *
     * @param id
     * @param newId
     */
    function duplicateElement(id, newId) {
        var element = getElement(id);
        console.log("duplicating element " + id);
        if ( typeof element !== "undefined" ) {
            var newElement = new Element();
            newElement.id = newId;
            newElement.root = element.root;
            newElement.mandatory = element.mandatory;
            for ( var i = 0; i < element.items.item.length; i++ ) {
                var item = element.items.item[i];
                var newItem = new Item();
                for ( var property in item ) {
                    newItem[property] = item[property];
                }
                // Adjust id
                newItem.id = item.id.replace(id, newId);
                if ( item.fixed == "false" ) {
                    // new item starts with no values
                    newItem.value = undefined;
                    newItem.codeValue = undefined;
                    newItem.urnValue = undefined;
                    newItem.languageNeutral = undefined;
                }
                newItem.elementId = newId;
                newElement.items.item.push(newItem);
                console.log(newItem);
            }
            var i = indexOfLastInstanceOf(id);
            content.elements.element.splice(i, 0, newElement);
            startListeningOnElement(newElement);
            // content.elements.element.insertAfter()
        }
    }

    function startListeningOnElement(element) {
        for ( var j = 0; j < element.items.item.length; j++ ) {
            element.items.item[j].startListening();
        }
    }
    function startListening() {
        console.log("startListening");
        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            console.log(element);
            for ( var j = 0; j < element.items.item.length; j++ ) {
                if ( typeof element.items.item[j].startListening === "function") {
                    element.items.item[j].startListening();
                } else {
                    console.log("no startListening method on item");
                    console.log(element.items.item[j]);
                }
            }
        }
    }

    function findItemById(id) {
        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            // console.log(element);
            for ( var j = 0; j < element.items.item.length; j++ ) {
                if ( element.items.item[j].id == id ) {
                    return element.items.item[j];
                }
            }
        }
        return undefined;
    }

    function update(item) {
        // item = this;
        var selector = "#" + item.id;
        if ( item.datatype == "code" || item.datatype == "codelist" || item.datatype == "query" ) {
            item.value = $("#" + $(selector).attr("id") + " option:selected").text();
            item.labelValue = $("#" + $(selector).attr("id") + " option:selected").text();
            item.codeValue = $(selector).val();
            item.languageNeutral = $("#" + $(selector).attr("id") + " option:selected").attr("language_neutral");
        } else if ( item.datatype == "autoCompletion" ) {
            item.value = $(selector).val();
            item.labelValue = $(selector).val();
            item.codeValue = $("#" + $(selector).attr("id") + "_uri").val();
            item.urnValue = $("#" + $(selector).attr("id") + "_urn").val();
            item.languageNeutral = item.codeValue;
            if ( $(selector).attr("useCode") == "true" ) {
                item.value = item.codeValue;
            }
            if ( $(selector).attr("useURN") == "true" ) {
                item.value = item.urnValue;
            }
        } else if ( item.datatype == "boolean" ) {
            item.value = $(selector).is(":checked");
            item.codeValue = item.value;
            item.languageNeutral = item.codeValue;

        } else if ( item.datatype == "date" || item.datatype == "dateRange" ) {
            item.value = $(selector).val();
            item.codeValue = "";
            item.languageNeutral = item.codeValue;
        } else {
            item.value = $(selector).val();
            item.codeValue = "";
            item.languageNeutral = item.codeValue;
        }
        if ( item.isLanguageNeutral && item.isLanguageNeutral == "true" ) {
            item.value = item.languageNeutral;
        }
        console.log(item.id + " changed to " + $(selector).val());
        /*
         if ( item.datatype != "ref" && $(this).attr("isLanguageNeutral") != "undefined" && $(this).attr("isLanguageNeutral") != "" && $(this).attr("language_neutral") != "undefined" && $(this).attr("language_neutral") != "" ) {
         item.value = item.languageNeutralValue;
         }
         */
        console.log(item);
        // edi.edimlOutput();

    }

    function updateItemForControl(control) {
        console.log("updating item for control " + control.attr("id"));
        console.log(control);
        var item = findItemById(control.attr("id"));
        update(item);
    }

    function updateAll() {
        for ( var i = 0; i < content.elements.element.length; i++ ) {
            var element = content.elements.element[i];
            // console.log(element);
            for ( var j = 0; j < element.items.item.length; j++ ) {
                update(element.items.item[j]);
            }
        }
    }

    function changeHandler() {
        var control = $(this);
        var id = control.attr("id");
        console.log("ediml change detected at " + id);


        var item = findItemById(id);
        console.log(item);

        if ( typeof item !== "undefined" ) {
            console.log("item " + id + " was found with a value of " + item.value + " and is about to be updated");
            update(item);
            console.log("item has been updated to " + item.value);
        }
    }

    return {
        content: content,
        addElement: addElement,
        removeElement: removeElement,
        getElement: getElement,
        loadEDIML: loadEDIML,
        fillInEdiMl: fillInEdiMl,
        duplicateElement: duplicateElement,
        startListening: startListening,
        findItemById: findItemById,
        inheritSettings: inheritSettings,
        changeHandler: changeHandler,
        post: post,
        update: update,
        updateItemForControl: updateItemForControl,
        load: load,
        saveAs: saveAs,
        edimls: edimls,
        downloadMetadata: downloadMetadata
    };
})();