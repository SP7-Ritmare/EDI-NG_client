/**
 * Created by fabio on 19/11/14.
 */
var itemRenderer = (function() {
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
        loadScript("textbox");
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
                        return "textbox";
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
        textbox.render();
        combobox.render();
        autocompletion.render();
        date.render();
        dateRange.render();
        label.render();
        boundingBox.render();
    }

    init();

    return {
        getRenderer: getRenderer,
        render: render
    }
})();
