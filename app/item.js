/**
 * @class Item
 * @author Fabio Pavesi (fabio@adamassoft.it)
 *
 * @property {String} id - the ID
 * @property {String} elementId - ID of the element it belongs to
 * @property {String} path - output path in destination XML
 * @property {String} datatype - template's <hasDatatype>: e.g. codelist, string, date, dateRange, boundingBox, ...
 * @property {String} fixed - template's <isFixed>: "true" means the item cannot be modified by the user
 * @property {String} useCode - output URI value to {@link path} in XML
 * @property {String} useURN - output URN value to {@link path} in XML
 * @property {String} outIndex - output order for this item
 * @property {String} value - current value
 * @property {String} labelValue - language specific description
 * @property {String} codeValue - URN value
 * @property {String} urnValue - URN value
 * @property {String} languageNeutral - language neutral value
 * @property {String} listeningFor - UI element connected to this item
 * @property {String} isLanguageNeutral - use language neutral value from datasource for the {@link labelValue}

 */
var Item = (function() {
    var logger = new Logger(availableContexts.ITEM);

    var item = {
        id: undefined,
        elementId: undefined,
        path: undefined,
        datatype: undefined,
        fixed: undefined,
        useCode: undefined,
        useURN: undefined,
        outIndex: undefined,
        value: undefined,
        labelValue: undefined,
        codeValue: undefined,
        urnValue: undefined,
        languageNeutral: undefined,
        listeningFor: undefined,
        isLanguageNeutral: undefined,
        startListening: function() {
            var item = this;
            logger.log("listening for " + "#" + item.id);
            item.listeningFor = "#" + item.id;
            // $("#" + item.id).unbind("change", update);
            $("#" + item.id).change(ediml.changeHandler);
        },
        /**
         * @method
         * @memberOf Item
         */
        isMandatory: function() {
            var element = ediml.getElement(elementId);
            return ( element.mandatory != "NA" );
        },
        /**
         * @method
         * @memberOf Item
         */
        getAlternativeElement: function() {
            var item = this;
            if ( typeof item.elementId === "undefined" ) {
                logger.error("item " + item.id + " has no associated element");
                logger.log(item);
                return;
            }
            var element = ediml.getElement(item.elementId);
            if ( element.alternativeTo ) {
                return ediml.getElement(element.alternativeTo);
            }
            return undefined;
        }
    };

    return item;
});