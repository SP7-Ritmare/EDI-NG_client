/**
 * Combobox renderer<br>
 * It compiles all <control_combobox> tags that have been inserted into HTML, and turns them into HTML <select>s<br>
 *
 * If the template item was connected to a datasource, the <select> will also be.
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var Combobox = (function() {
    var logger = new Logger(availableContexts.COMBO);
    /**
     *
     * @memberOf Combobox
     */
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

            ItemRenderer.copyAttributesFrom(element, item, theItem);

            theElement.addItem(theItem);

            control = $(control);
            control.attr("datasource", item.datasource);
            control.attr("datatype", item.hasDatatype);
            control.attr("id", $(this).attr("id"));
            control.attr("show", item.show);
            control.attr("defaultValue", item.defaultValue);
            control.attr("field", item.field);
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
            var labels = $(this).find("label, helps");
            $(labels).addClass(defaults.labelCSS);
            logger.log(labels);
            html.append(labels);
            html.append(control);
            $(this).replaceWith(html);

            /*
            if (item.hasDatatype == "select") {
                var ds = DataSourcePool.getInstance().findById(item.datasource);
                ds.addEventListener("selectionChanged", function (event) {
                    logger.log(event + " received");
                    var row = ds.getCurrentRow();
                    $("#" + item.id).val(row[item.field]).trigger("change");
                });
            }
            if (item.hasDatatype == "copy") {
                logger.log(item.id);
                $("#" + item.itemId).change(function (event) {
                    logger.log(event + " received");
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