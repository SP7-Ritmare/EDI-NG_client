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
        Textbox.render();
        Boolean.render();
        Combobox.render();
        Autocompletion.render();
        Dates.render();
        DateRange.render();
        Label.render();
        BoundingBox.render();
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
