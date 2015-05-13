/**
 * DateRange renderer<br>
 * It compiles all <control_daterange> tags that have been inserted into HTML, and turns them into pairs of Bootstrap datepickers<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var DateRange = (function() {
    var logger = new Logger(availableContexts.DATE_RANGE);
    /**
     *
     * @memberOf DateRange
     */
    function render() {
        var control, control2;
        $("control_daterange").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;

            control = $.parseHTML("<input type='text' class='" + defaults.controlCSS + " " + item.hasDatatype + "-input'>");
            control2 = $.parseHTML("<input type='text' class='" + defaults.controlCSS + " " + item.hasDatatype + "-input'>");

            var theElement = ediml.getElement(element.id);
            var theItem = new Item();
            ItemRenderer.copyAttributesFrom(element, item, theItem);

            theItem.id = item.id + "_start";
            theItem.path = item.start.hasPath;
            theElement.addItem(theItem);

            theItem = new Item();
            ItemRenderer.copyAttributesFrom(element, item, theItem);
            theItem.id = item.id + "_end";
            theItem.path = item.end.hasPath;
            theElement.addItem(theItem);

            control = $(control);
            control2 = $(control2);

            control.attr("datatype", item.hasDatatype);
            control.attr("id", item.id + "_start");
            control.attr("querystringparameter", item.start.queryStringParameter);

            control2.attr("datatype", item.hasDatatype);
            control2.attr("id", item.id + "_end");
            control2.attr("querystringparameter", item.end.queryStringParameter);

            if (item.isFixed == "true") {
                control.val(item.hasValue);
                control.addClass("fixed");
                control2.val(item.hasValue);
                control2.addClass("fixed");
            }
            if (element.isMandatory != "NA") {
                control.attr("required", "required");
                control2.attr("required", "required");
            }
            control = $($.parseHTML('<div class="' + defaults.controlGroupCSS + ' date col-md-6" data-date-format="yyyy-mm-dd">')).append(control);
            control.append('<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>');

            control2 = $($.parseHTML('<div class="' + defaults.controlGroupCSS + ' date col-md-6" data-date-format="yyyy-mm-dd">')).append(control2);
            control2.append('<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>');

            var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
            html = $(html);

            var labels = "";
            var labels2 = "";
            if ( item.start && item.start.label ) {

                for (var k = 0; k < item.start.label.length; k++) {
                    labels += "<label for='" + item.id + "_start' language='" + item.start.label[k]["_xml:lang"] + "";
                    labels += "'>" + item.start.label[k]["__text"] + "</label>";
                }
            }
            if ( item.end && item.end.label ) {
                for (var k = 0; k < item.end.label.length; k++) {
                    labels2 += "<label for='" + item.id + "_end' language='" + item.end.label[k]["_xml:lang"] + "";
                    labels2 += "'>" + item.end.label[k]["__text"] + "</label>";
                }
            }

            $(labels).addClass(defaults.labelCSS);
            logger.log(labels);
            $(labels2).addClass(defaults.labelCSS);
            logger.log(labels2);
            html.append(labels);
            html.append(control);
            html.append(labels2);
            html.append(control2);
            $(this).replaceWith(html);

        });
    }

    return {
        render: render
    };

})();
