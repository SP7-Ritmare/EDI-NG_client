/**
 * Created by fabio on 04/12/14.
 */
/**
 * Created by fabio on 28/11/14.
 */
var label = (function() {
    function render() {
        var control;
        $("control_label").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;

            control = $.parseHTML("<label class='" + defaults.controlCSS + " " + item.hasDatatype + "-input'>");
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
            theItem.hasIndex = item.hasIndex;
            theItem.outIndex = item.outIndex;
            theItem.itemId = item.itemId;
            theItem.show = item.show;
            theItem.field = item.field;
            theItem.isLanguageNeutral = item.isLanguageNeutral;
            theItem.query = ( item.hasValue ? item.hasValue.toString() : undefined );
            theElement.addItem(theItem);

            control = $(control);

            control.attr("datatype", item.hasDatatype);
            control.attr("datasource", item.datasource);
            control.attr("show", item.show);
            control.attr("id", $(this).attr("id"));
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
            if ( item.show != "hidden" ) {
                html.append(labels);
            }
            html.append(control);
            $(this).replaceWith(html);
            /*
            if (item.hasDatatype == "select") {
                var ds = DataSourcePool.getInstance().findById(item.datasource);
                ds.addEventListener("selectionChanged", function (event) {
                    console.log(event + " received (label)");
                    var row = ds.getCurrentRow();
                    $("#" + item.id).text(row[item.field]);
                });
            }
             if (item.hasDatatype == "copy") {
             console.log(item.id);
             $("#" + item.itemId).change(function (event) {
             console.log(event + " received");
             $("#" + item.id).val($(this).val()).trigger("change");
             });
             }
             */

        });
    }
    return {
        render: render
    };

})();