/**
 * Created by fabio on 28/11/14.
 */
var autocompletion = (function() {
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
            theItem.field = item.field;
            theItem.isLanguageNeutral = item.isLanguageNeutral;
            theElement.addItem(theItem);

            control = $(control);

            control.attr("id", $(this).attr("id"));
            control.attr("datatype", item.hasDatatype);
            control.attr("querystringparameter", item.queryStringParameter);
            if (item.isFixed == "true") {
                control.val(item.hasValue);
                control.addClass("fixed");
            }
            if (element.mandatory != "NA") {
                control.attr("required", "required");
            }
            var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
            html = $(html);
            var labels = $(this).find("label");
            $(labels).addClass(defaults.labelCSS);
            console.log(labels);
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
                });

        });
    }

    return {
        render: render
    };

})();