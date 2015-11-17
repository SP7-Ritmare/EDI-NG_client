/**
 *
 * This module represents EDIML's lifecycle<br>
 * The 'content' attribute represents the actual core.<br>
 * The weird structure of the <i>content</i> object is a trade off needed to allow this structure to exchange data in XML form compatible with both the xml2json.js/json2xml.js conversions and JAXB's server side conversion.<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 *
 */

var ediml = (function () {
    var metadataEndpoint;
    var settings;
    var edimls = {};
    var isDirty = false;
    var logger = new Logger(availableContexts.EDIML);

    var content = {
        elements: {
            ediVersion: 2.0,
            version: undefined,
            template: undefined,
            templateDocument: undefined,
            fileId: undefined,
            fileUri: undefined,
            user: undefined,
            baseDocument: undefined,
            xsltChain: undefined,
            element: []
        }
    };

    function doDebug(msg) {
        logger.log(msg);
    }

    function inheritSettings(newSettings) {
        settings = newSettings;
        metadataEndpoint = settings.metadataEndpoint;
        if (typeof metadataEndpoint === "undefined") {
            metadataEndpoint = defaults.metadataEndpoint;
        }
        if (typeof settings.baseDocument !== "undefined") {
            content.elements.baseDocument = settings.baseDocument;
        }
        if (typeof settings.xsltChain !== "undefined") {
            content.elements.xsltChain = settings.xsltChain;
        }
    }

    var defaultPostErrorCallback = function () {
        $("#mdcontent").prepend("<pre class='prettypring lang-json'>" + JSON.stringify(arguments, undefined, 2) + "</pre>");
        prettyPrint();

        logger.log(arguments);
    };

    var defaultPostSuccessCallback = function (msg) {
        logger.log(msg);
        if (msg.responseCode == 200) {
            isDirty = false;
            edi.setGeneratedXml(msg.generatedXml);
            alert("your XML has been correctly generated");
            var xmlString = msg.generatedXml;
            if (false && xmlString.indexOf("sml:SensorML") >= 0) {
                xmlString = formatXml(xmlString);
                $("#mdcontent").prepend("<pre class='prettyprint lang-html linenums:1'>" + xmlString.encodeHTML() + "</pre>");
                prettyPrint();

                $.ajax({
                    type: "POST",
                    url: "sos/registerSensor",
                    contentType: "application/xml",
                    processData: true,
                    data: (xmlString),
                    success: function (msg) {
                        var xmlString = xmlToString(msg);
                        var newWindow = window.open("data:text/xml," + encodeURIComponent(xmlString), "_blank");
                        $.ajax({
                            type: "POST",
                            url: "http://sp7.irea.cnr.it/sigosos/SOS32/sos",
                            contentType: "application/xml",
                            processData: true,
                            data: (xmlString),
                            success: function (msg) {
                                var xmlString = xmlToString(msg);
                                var newWindow = window.open("data:text/xml," + encodeURIComponent(xmlString), "_blank");
                            },
                            error: function () {
                                var newWindow2 = window.open("data:text/xml," + encodeURIComponent(arguments.responseText), "_blank");
                                // doDebug('Failed ' + JSON.stringify(arguments));
                            }
                        });
                    },
                    error: function () {
                        var newWindow2 = window.open("data:text/xml," + encodeURIComponent(arguments.responseText), "_blank");
                        doDebug('Failed ' + JSON.stringify(arguments));
                    }
                });
            } else {
                xmlString = formatXml(xmlString);
                $("#mdcontent").prepend("<pre class='prettyprint lang-html linenums:1'>" + xmlString.encodeHTML() + "</pre>");
                $("#mdcontent").prepend("<pre class='prettyprint lang-json'>" + JSON.stringify(msg, undefined, 2) + "</pre>");
                prettyPrint();
            }
        } else {

            $("#mdcontent").prepend("<pre class='prettyprint lang-json'>" + JSON.stringify(msg, undefined, 2) + "</pre>");
            prettyPrint();
        }
        $("#MDDownload").show();
        $("#EDIMLDownload").show();
    };

    function post() {
        $("#MDDownload").hide();

        if (settings.requiresValidation == "true") {
            if (!validator.validate()) {
                alert(validator.getErrorCount() + " errors, " + validator.getWarningCount() + " warnings");
                return;
            }
            if (validator.getWarningCount() > 0 && !$("#ignoreWarnings").prop("checked")) {
                alert(validator.getWarningCount() + " warnings");
                return;
            }
        }
        var postMetadata = function (data) {
            edi.setGeneratedXml(undefined);

            content.elements.fileId = data.id;
            content.elements.fileUri = metadataEndpoint + "rest/ediml/" + data.uri;
            if (typeof successCallback == 'undefined') {
                successCallback = defaultPostSuccessCallback;
            }
            if (typeof errorCallback == 'undefined') {
                errorCallback = defaultPostErrorCallback;
            }

            var x2js = new X2JS();
            var xml = /* '<?xml version="1.0" encoding="UTF-8"?>' + */ (x2js.json2xml_str(content));
            if (querystring("debug") == "on") {
                $("#mdcontent").prepend("<pre class='prettyprint lang-html linenums:1'>" + formatXml(xml).encodeHTML() + "</pre>");
                prettyPrint();
            }


            $.ajax({
                type: "POST",
                url: metadataEndpoint + "rest/metadata",
                dataType: "json",
                contentType: "application/xml",
                processData: true,
                data: (xml),
                success: successCallback,
                error: errorCallback
            });
        }
        if (content.elements.fileId /*querystring("edit")*/) {
            postMetadata({
                id: content.elements.fileId,
                uri: metadataEndpoint + "rest/ediml/" + content.elements.fileId
            });
        } else {
            $.ajax({
                type: "GET",
                url: metadataEndpoint + "rest/ediml/requestId",
                dataType: "json",
                success: postMetadata,
                error: function () {
                    alert("error on " + metadataEndpoint + "rest/ediml/requestId");
                    logger.log(arguments);
                }
            });
        }
    }

    /**
     * Loads EDIML from the metadataEndpoint defined in the template's settings
     *
     * @memberOf ediml
     * @param edimlId   the EDIML record to be fetched
     * @param callback  who to call when done
     */
    function loadEDIML(edimlId, callback) {
        if (typeof edimlId === "undefined" || edimlId == "") {
            return;
        }
        $.ajax({
            url: metadataEndpoint + "rest/ediml/" + edimlId,
            dataType: "xml",
            success: function (data) {
                var x2j = new X2JS();
                var json = x2j.xml2json(data);
                logger.log(json);
                var elementsToReorder = [];

                for (var i = 0; i < json.elements.element.length; i++) {
                    if (json.elements.element[i].id != json.elements.element[i].represents_element) {
                        if (!contains(elementsToReorder, json.elements.element[i].represents_element)) {
                            elementsToReorder.push(json.elements.element[i].represents_element);
                        }
                    }
                }
                for (var i = 0; i < elementsToReorder.length; i++) {
                    reorderElements(json.elements.element, elementsToReorder[i]);
                }
                callback(json.elements);
            }
        });
    };

    function contains(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == item) {
                return true;
            }
        }
        return false;
    }

    function reorderElements(elements, baseElement) {
        var logger = new Logger("reorderElement");
        logger.error("element " + baseElement + " needs to be reordered");
        var temp = [];
        var tempPos = [];

        logger.log(elements);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            // logger.log("considering " + element.id);
            if (element.represents_element == baseElement) {
                logger.log("adding " + element.id);
                temp.push(element);
                tempPos.push(i);
            }
        }
        temp.sort(function (a, b) {
            return a.id > b.id;
        });
        logger.log(temp);
        for (var i = 0; i < temp.length; i++) {
            elements[tempPos[i]] = temp[i];
            logger.log("setting element " + tempPos[i] + " to " + temp[i].id)
        }
        logger.log(elements);
    }

    function fixJSONDiscrepancies() {
        var logger = new Logger("editfillin");
        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            if ($.isArray(element.items)) {
                var temp = element.items.item;
                element.items = {};
                if ($.isArray(temp)) {
                    element.items.item = temp;
                } else {
                    element.items.item = [temp];
                }
            }

        }
    }

    /**
     * Load EDIML from localStorage (if available)
     *
     * @param name  name the EDIML was saved as
     */
    function load(name) {
        if (typeof(Storage) !== "undefined") {
            logger.log(localStorage.edimls);
            if (typeof localStorage.edimls !== "undefined") {
                edimls = JSON.parse(localStorage.edimls);
                logger.log(edimls[name]);
                fillInEdiMl(edimls[name].ediml.elements);
                setTimeout(function () {
                    DataSourcePool.getInstance().refreshAll();
                }, settings.refreshDelay);

            }
        } else {
            // Sorry! No Web Storage support..
            alert("No local storage");
        }
    }

    /**
     * Saves current EDIML state to localStorage
     * WARNING: the EDIML is saved as is, with no validation
     *
     * @memberOf ediml
     * @param name  name to be assigned to this instance
     */
    function saveAs(name) {
        var data = {
            ediml: content,
            date: new Date()
        };

        if (typeof(Storage) !== "undefined") {
            edimls[name] = data;
            localStorage.edimls = JSON.stringify(edimls);
            logger.log(localStorage.edimls);
            logger.log(edimls);
        } else {
            // Sorry! No Web Storage support..
            alert("No local storage");
        }
    }

    function saveFileAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = uri;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

    function downloadMetadata() {
        var newWindow1 = saveFileAs("data:text/xml;charset=utf-8," + encodeURIComponent(edi.getGeneratedXml()), "generated_" + content.elements.fileId + ".xml");
    }

    function downloadEDIML() {
        var x2js = new X2JS();
        var xml = /* '<?xml version="1.0" encoding="UTF-8"?>' + */ (x2js.json2xml_str(content));

        var newWindow1 = saveFileAs("data:text/xml;charset=utf-8," + encodeURIComponent(xml), "ediml_" + content.elements.fileId + ".xml");
    }

    /**
     * Fills in the HTML form with contents of the EDIML parameter
     *
     * @memberOf ediml
     * @param ediMl
     */
    function fillInEdiMl(ediMl) {
        var logger = new Logger("editfillin");
        var element;
        var item;
        var cloneSuffix = edi.cloneSuffix;
        logger.log("ediml caricato:");
        logger.log(ediMl);
        content.elements.fileId = ediMl.fileId;
        content.elements.fileUri = ediMl.fileUri;
        content.elements.template = ediMl.templateName;
        content.elements.version = ediMl.version;
        content.elements.ediVersion = defaults.ediVersion;
        content.elements.starterKitUri = ediMl.starterKitUri;
        content.elements.element = ediMl.element;
        content.elements.baseDocument = ediMl.baseDocument;
        fixJSONDiscrepancies();

        logger.log(content.elements);
        var elements = content.elements;
        for (var i = 0; i < elements.element.length; i++) {
            element = elements.element[i];
            if (element.id.indexOf(cloneSuffix) == -1) {
                logger.log(element);
                if (!$.isArray(element.items.item)) {
                    element.items.item = [element.items.item];
                }
                for (var j = 0; element.items.item && j < element.items.item.length; j++) {
                    item = element.items.item[j];
                    var newItem = new Item();
                    for (var key in item) {
                        newItem[key] = item[key];
                    }
                    element.items.item[j] = newItem;
                    item = element.items.item[j];

                    if (typeof item.datatype === "undefined" && typeof item.dataType !== "undefined") {
                        item.datatype = item.dataType;
                    }
                    if (item.datatype == "codelist" || item.datatype == "query") {
                        $("#" + item.id).val(item.codeValue).trigger("change");
                    } else if (item.datatype == "autoCompletion") {
                        $("#" + item.id).val(item.value);
                        $("#" + item.id + "_uri").val(item.codeValue);
                        $("#" + item.id + "_urn").val(item.urnValue);
                    } else {
                        $("#" + item.id).val(item.value).trigger("change");
                    }
                }
            } else {
                var logger = new Logger("duplicator");
                var represents_element = element.id.replaceAll(cloneSuffix, "");
                logger.log("represents_element: " + represents_element);
                logger.log("element: " + element.id);
                edi.duplicateElement(represents_element, element.id, false);
                if (!$.isArray(element.items.item)) {
                    element.items.item = [element.items.item];
                }
                for (var j = 0; element.items.item && j < element.items.item.length; j++) {
                    item = element.items.item[j];
                    var newItem = new Item();
                    for (var key in item) {
                        newItem[key] = item[key];
                    }
                    element.items.item[j] = newItem;
                    item = element.items.item[j];

                    if (item.datatype == "codelist" || item.datatype == "query") {
                        $("#" + item.id).val(item.codeValue);
                    } else if (item.datatype == "autoCompletion") {
                        $("#" + item.id).val(item.value);
                        $("#" + item.id + "_uri").val(item.codeValue);
                        $("#" + item.id + "_urn").val(item.urnValue);
                    } else {
                        $("#" + item.id).val(item.value).trigger("change");
                    }
                }
            }
        }
        $("select[languageselector='true']").trigger('change');


        setTimeout(function () {
            $("input", ".uris").trigger("change");
        }, defaults.selectsDelay);

    };


    function indexOfLastInstanceOf(id) {
        var found = false;

        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            if (element.id == id) {
                found = true;
            }
            if (found && element.represents_element != id) {
                return i;
            }
        }
        if (found) {
            return content.elements.element.length - 1;
        } else {
            throw "Element " + id + " is not present";
        }
    }

    function addElement(element) {
        content.elements.element.push(element);
    }

    function removeElement(element_id) {
        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            if (element.id == element_id) {
                content.elements.element.splice(i, 1);
                return;
            }
        }
    }

    function getElement(id) {
        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            if (element.id == id) {
                return element;
            }
        }
        return undefined;
    }

    /**
     * Duplicates an EDIML element, but not its HTML representation
     *
     * @memberOf ediml
     * @param id
     * @param newId
     */
    function duplicateElement(id, newId) {
        var logger = new Logger("duplicator");

        var element = getElement(id);
        logger.log("duplicating element " + id);
        if (typeof element !== "undefined") {
            var newElement = new Element();
            newElement.id = newId;
            newElement.root = element.root;
            newElement.mandatory = element.mandatory;
            newElement.represents_element = element.represents_element;
            for (var i = 0; i < element.items.item.length; i++) {
                var item = element.items.item[i];
                var newItem = new Item();
                for (var property in item) {
                    newItem[property] = item[property];
                }
                // Adjust id
                newItem.id = item.id.replace(id, newId);
                if (item.fixed == "false") {
                    // new item starts with no values
                    newItem.value = undefined;
                    newItem.codeValue = undefined;
                    newItem.urnValue = undefined;
                    newItem.languageNeutral = undefined;
                }
                newItem.elementId = newId;
                newElement.items.item.push(newItem);
                logger.log(newItem);
            }
            var i = indexOfLastInstanceOf(id);
            content.elements.element.splice(i, 0, newElement);
            startListeningOnElement(newElement);
            // content.elements.element.insertAfter()
        }
    }

    function startListeningOnElement(element) {
        for (var j = 0; j < element.items.item.length; j++) {
            element.items.item[j].startListening();
        }
    }

    function startListening() {
        logger.log("startListening");
        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            logger.log(element);
            for (var j = 0; j < element.items.item.length; j++) {
                if (typeof element.items.item[j].startListening === "function") {
                    element.items.item[j].startListening();
                } else {
                    logger.log("no startListening method on item");
                    logger.log(element.items.item[j]);
                }
            }
        }
    }

    function findItemById(id) {
        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            // logger.log(element);
            for (var j = 0; j < element.items.item.length; j++) {
                if (element.items.item[j].id == id) {
                    return element.items.item[j];
                }
            }
        }
        return undefined;
    }

    function update(item) {
        if (typeof item === "undefined") {
            console.trace();
            return;
        }
        // item = this;
        isDirty = true;
        var selector = "#" + item.id;
        if (item.datatype == "code" || item.datatype == "codelist" || item.datatype == "query") {
            item.value = $("#" + $(selector).attr("id") + " option:selected").text();
            item.labelValue = $("#" + $(selector).attr("id") + " option:selected").text();
            item.codeValue = $(selector).val();
            item.languageNeutral = $("#" + $(selector).attr("id") + " option:selected").attr("language_neutral");
        } else if (item.datatype == "autoCompletion") {
            item.value = $(selector).val();
            item.labelValue = $(selector).val();
            item.codeValue = $("#" + $(selector).attr("id") + "_uri").val();
            item.urnValue = $("#" + $(selector).attr("id") + "_urn").val();
            item.languageNeutral = item.codeValue;
            if ($(selector).attr("useCode") == "true") {
                item.value = item.codeValue;
            }
            if ($(selector).attr("useURN") == "true") {
                item.value = item.urnValue;
            }
        } else if (item.datatype == "boolean") {
            item.value = $(selector).is(":checked");
            item.codeValue = item.value;
            item.languageNeutral = item.codeValue;

        } else if (item.datatype == "date" || item.datatype == "dateRange") {
            item.value = $(selector).val();
            item.codeValue = "";
            item.languageNeutral = item.codeValue;
        } else {
            item.value = $(selector).val();
            item.codeValue = "";
            item.languageNeutral = item.codeValue;
        }
        if (item.isLanguageNeutral && item.isLanguageNeutral == "true") {
            item.value = item.languageNeutral;
        }
        logger.log(item.id + " changed to " + $(selector).val());
        logger.log(item);

    }

    function updateItemForControl(control) {
        logger.log("updating item for control " + control.attr("id"));
        logger.log(control);
        var item = findItemById(control.attr("id"));
        update(item);
    }

    function updateAll() {
        for (var i = 0; i < content.elements.element.length; i++) {
            var element = content.elements.element[i];
            // logger.log(element);
            for (var j = 0; j < element.items.item.length; j++) {
                update(element.items.item[j]);
            }
        }
    }

    function changeHandler() {
        var control = $(this);
        var id = control.attr("id");
        logger.log("ediml change detected at " + id);


        var item = findItemById(id);
        logger.log(item);

        if (typeof item !== "undefined") {
            logger.log("item " + id + " was found with a value of " + item.value + " and is about to be updated");
            update(item);
            logger.log("item has been updated to " + item.value);
        }
    }

    return {
        content: content,
        isDirty: function () {
            return isDirty;
        },
        setDirty: function (value) {
            isDirty = value;
        },
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
        setPostCallbackSuccess: function (cb) {
            successCallback = cb;
        },
        setPostCallbackError: function (cb) {
            errorCallback = cb;
        },
        post: post,
        update: update,
        updateItemForControl: updateItemForControl,
        load: load,
        saveAs: saveAs,
        edimls: edimls,
        downloadMetadata: downloadMetadata,
        downloadEDIML: downloadEDIML
    };
})();