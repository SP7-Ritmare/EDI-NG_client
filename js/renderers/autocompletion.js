/**
 * Autocompletion renderer<br>
 * It compiles all <control_autocompletion> tags that have been inserted into HTML, and turns them into fully functional bootstrap typeahead fields<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var Autocompletion = (function() {
    var logger = new Logger(availableContexts.AUTOCOMPLETION);
    /**
     *
     * @memberOf Autocompletion
     */
    function render() {
        var control;
        $("control_autocompletion").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;
            var id = item.id;

            control = $.parseHTML("<input type='text' class='" + defaults.controlCSS + " typeahead'>");
            $(control).attr("useCode", item.useCode);
            var suffix = '<div class="uris"><p><input type="text" disabled="disabled" size="80" id="' + id + '_uri"/></p><p><input type="text" disabled="disabled" size="80" id="' + id + '_urn"/></p></div>';

            suffix += '<div id="' + id + '_debug_info' + '" class="debug_info"><label>datasource</label>&nbsp;<label>' + item.datasource + '</label>';
            var theElement = ediml.getElement(element.id);
            var theItem = new Item();
            theItem.id = item.id;
            ItemRenderer.copyAttributesFrom(element, item, theItem);

            theElement.addItem(theItem);

            control = $(control);

            control.attr("id", $(this).attr("id"));
            control.attr("datatype", item.hasDatatype);
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
            html.append(suffix);
            $(this).replaceWith(html);

            $("#" + id).removeAttr("hasValue");
            $("#" + id).removeAttr("path");
            $("#" + id).attr("datasource", item.datasource);

            $("#" + id).typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 3
                },
                {
                    name: "ds_" + id + "",
                    displayKey: 'l',
                    source: edi.substringMatcher(item.datasource, id)
                }).bind('typeahead:selected', function(obj, datum, name) {
                    $("#" + id + "_uri").val(datum.c);
                    $("#" + id + "_uri").trigger("change");
                    $("#" + id + "_urn").val(datum.urn);
                    $("#" + id + "_urn").trigger("change");
                    ediml.updateItemForControl($("#" + id));
                    var ds = DataSourcePool.getInstance().findById(item.datasource);
                    ds.setCurrentRow("c", datum.c);
                }).blur(function(event) {
                    logger.log("Changed: " + event.target.value);
                    if ( event.target.value.trim() == "" ) {
                        $("#" + id + "_uri").val("");
                        $("#" + id + "_uri").trigger("change");
                        $("#" + id + "_urn").val();
                        $("#" + id + "_urn").trigger("change");
                        ediml.updateItemForControl($("#" + id));
                        var ds = DataSourcePool.getInstance().findById(item.datasource);
                        ds.setCurrentRow("c", -1);
                    }
                });

        });
    }

    return {
        render: render
    };

})();