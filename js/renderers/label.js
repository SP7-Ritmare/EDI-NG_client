/**
 * Label renderer<br>
 * It compiles all <control_label> tags that have been inserted into HTML, and turns them into labels<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var Label = (function() {
    /**
     *
     * @memberOf Label
     */
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

            ItemRenderer.copyAttributesFrom(element, item, theItem);

            theElement.addItem(theItem);

            control = $(control);

            control.attr("datatype", item.hasDatatype);
            control.attr("datasource", item.datasource);
            control.attr("show", item.show);
            control.attr("id", $(this).attr("id"));
            control.attr("querystringparameter", item.queryStringParameter);
            if (item.isFixed == "true") {
                control.addClass("fixed");
            }
            control.text(item.hasValue);
            if (element.isMandatory != "NA") {
                control.attr("required", "required");
            }
            var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
            html = $(html);
            var labels = $(this).find("label, helps");
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