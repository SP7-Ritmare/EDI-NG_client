/**
 * Created by fabio on 28/11/14.
 */
/**
 * Created by fabio on 28/11/14.
 */
var combobox = (function() {
    function render() {
        var control;
        $("control_combobox").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;

            control = $.parseHTML("<input type='text' class='" + defaults.controlCSS + " text-input'>");
            control = $.parseHTML("<select class='" + defaults.controlCSS + " codelist'>");

            var theElement = ediml.getElement(element.id);
            var theItem = new Item();
            theItem.id = item.id;
            theItem.datatype = item.hasDatatype;
            theItem.datasource = item.datasource;
            theItem.path = item.hasPath;
            theItem.elementId = element.id;
            theItem.fixed = item.isFixed;
            theItem.useCode = item.useCode;
            theItem.useURN = item.useURN;
            theItem.outIndex = item.outIndex;
            theItem.itemId = item.itemId;
            theItem.show = item.show;
            theItem.field = item.field;
            theItem.defaultValue = item.defaultValue;
            theItem.isLanguageNeutral = item.isLanguageNeutral;
            theElement.addItem(theItem);

            control = $(control);
            control.attr("datasource", item.datasource);
            control.attr("datatype", item.hasDatatype);
            control.attr("id", $(this).attr("id"));
            control.attr("show", item.show);
            control.attr("defaultValue", item.defaultValue);
            control.attr("querystringparameter", item.queryStringParameter);
            if (item.isFixed == "true") {
                control.val(item.hasValue);
                control.addClass("fixed");
            }
            if (element.isMandatory != "NA") {
                control.attr("required", "required");
            }
            var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
            html = $(html);
            var labels = $(this).find("label");
            $(labels).addClass(defaults.labelCSS);
            console.log(labels);
            html.append(labels);
            html.append(control);
            $(this).replaceWith(html);

            /*
            if (item.hasDatatype == "select") {
                var ds = DataSourcePool.getInstance().findById(item.datasource);
                ds.addEventListener("selectionChanged", function (event) {
                    console.log(event + " received");
                    var row = ds.getCurrentRow();
                    $("#" + item.id).val(row[item.field]).trigger("change");
                });
            }
            if (item.hasDatatype == "copy") {
                console.log(item.id);
                $("#" + item.itemId).change(function (event) {
                    console.log(event + " received");
                    $("#" + item.id).val($(this).val());
                });
            }
            */

        });
    }

    return {
        render: render
    };

})();