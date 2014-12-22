/**
 * Created by fabio on 28/11/14.
 */
var date = (function() {
    function render() {
        var control;
        $("control_date").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;

            control = $.parseHTML("<input type='text' class='" + defaults.controlCSS + "'>");

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
            theItem.isLanguageNeutral = item.isLanguageNeutral;
            theItem.defaultValue = item.defaultValue;
            theItem.field = item.field;
            theItem.query = ( item.hasValue ? item.hasValue.toString() : undefined );
            theElement.addItem(theItem);

            control = $(control);

            control.attr("datatype", item.hasDatatype);
            control.attr("defaultValue", item.defaultValue);
            control.attr("id", $(this).attr("id"));
            control.attr("querystringparameter", item.queryStringParameter);
            if (element.isMandatory != "NA") {
                control.attr("required", "required");
            }
            if (item.isFixed == "true") {
                control.val(item.hasValue);
                control.addClass("fixed");
            } else {
                control.addClass(item.hasDatatype + "-input");
                control = $($.parseHTML('<div class="' + defaults.controlGroupCSS + ' date" data-date-format="yyyy-mm-dd">')).append(control);
                control.append('<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>');
            }

            var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( (item.hasDatatype == "date" && item.isFixed != "true" ) ? " date" : "" ) + "'>");
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
                    $("#" + item.id).val(row[item.field]);
                });
            }
            if (item.hasDatatype == "copy") {
                console.log(item.id);
                $("#" + item.item).change(function (event) {
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