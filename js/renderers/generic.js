/**
 * Created by fabio on 19/11/14.
 */
var ItemRenderer = (function() {
    function loadScript(script) {
            $('<script>')
                .attr('type', 'text/javascript')
                .attr('src', 'js/renderers/' + script + ".js")
                .appendTo('head');
    }

    function init() {
        /*
        loadScript("autocompletion");
        loadScript("combobox");
        loadScript("date");
        loadScript("date_range");
        loadScript("label");
        loadScript("Textbox");
        */
    }

    function getRenderer(item) {
        switch(item.show) {
            case "textbox":
            case "combobox":
            case "label":
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

    function render() {
        Textbox.render();
        Combobox.render();
        Autocompletion.render();
        Dates.render();
        DateRange.render();
        Label.render();
        BoundingBox.render();
    }

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

    init();

    return {
        getRenderer: getRenderer,
        copyAttributesFrom: copyAttributesFrom,
        render: render
    }
})();
