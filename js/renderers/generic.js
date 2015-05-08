/**
 * This is the main renderer<br>
 * It manages calls to the specific renderers<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var ItemRenderer = (function() {
    /**
     * Picks the correct specific renderers
     *
     * @memberOf ItemRenderer
     * @param item
     * @returns {*}
     */
    function getRenderer(item) {
        switch(item.show) {
            case "textbox":
            case "combobox":
            case "label":
            case "boolean":
            case "image":
            case "qrcode":
                return item.show;
            default:
                switch(item.hasDatatype) {
                    case "code":
                    case "codelist":
                        return "combobox";
                    case "select":
                    case "copy":
                    case "string":
                    case "URN":
                    case "URI":
                    case "URL":
                    case "int":
                    case "real":
                    case "double":
                    case "text":
                    case "dependent":
                    case "ref":
                    case "autonumber":
                    case "hidden":
                        return "Textbox";
                    case "date":
                        return "date";
                    case "dateRange":
                        return "dateRange";
                    case "boundingBox":
                        return "boundingBox";
                    default:
                        return item.hasDatatype;
                }
        }
    }

    /**
     * Renders all specific renterers in turns
     *
     * @memberOf ItemRenderer
     */
    function render() {
        if ( typeof Textbox !== "undefined" ) {
            Textbox.render();
        }
        if ( typeof Boolean !== "undefined" ) {
            Boolean.render();
        }
        if ( typeof Combobox !== "undefined" ) {
            Combobox.render();
        }
        if ( typeof Autocompletion !== "undefined" ) {
            Autocompletion.render();
        }
        if ( typeof Dates !== "undefined" ) {
            Dates.render();
        }
        if ( typeof DateRange !== "undefined" ) {
            DateRange.render();
        }
        if ( typeof Label !== "undefined" ) {
            Label.render();
        }
        if ( typeof BoundingBox !== "undefined" ) {
            BoundingBox.render();
        }
        if ( typeof FunctionType !== "undefined" ) {
            FunctionType.render();
        }
        if ( typeof ImageType !== "undefined" ) {
            ImageType.render();
        }
        if ( typeof QRCode !== "undefined" ) {
            QRCode.render();
        }
    }

    /**
     * Copies attribute values from an input template form <element, item> to an internal <i>item</i> structure, meant to create the UI items
     *
     * @memberOf ItemRenderer
     * @param element
     * @param item
     * @param theItem
     */
    function copyAttributesFrom(element, item, theItem) {
        theItem.datatype = item.hasDatatype;
        theItem.datasource = item.datasource;
        theItem.path = item.hasPath;
        theItem.elementId = element.id;
        theItem.fixed = item.isFixed;
        theItem.useCode = item.useCode;
        theItem.useURN = item.useURN;
        theItem.hasIndex = item.hasIndex;
        theItem.outIndex = item.outIndex;
        theItem.field = item.field;
        theItem.isLanguageNeutral = item.isLanguageNeutral;

        theItem.itemId = item.itemId;
        theItem.show = item.show;

        theItem.defaultValue = item.defaultValue;

        theItem.query = ( item.hasValue ? item.hasValue.toString() : undefined );

        theItem.value = item.hasValue;
    }

    // init();

    return {
        getRenderer: getRenderer,
        copyAttributesFrom: copyAttributesFrom,
        render: render
    }
})();
