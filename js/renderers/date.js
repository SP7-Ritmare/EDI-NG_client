/**
 * Date renderer<br>
 * It compiles all <control_date> tags that have been inserted into HTML, and turns them into Bootstrap datepickers<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var Dates = (function() {
    var logger = new Logger(availableContexts.DATE);
    /**
     *
     * @memberOf Dates
     */
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
            ItemRenderer.copyAttributesFrom(element, item, theItem);

            if ( item.defaultValue == "$TODAY$" ) {
                item.defaultValue = $.format.date(new Date(), 'yyyy-MM-dd');
            }
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
            var labels = $(this).find("label, helps");
            $(labels).addClass(defaults.labelCSS);
            logger.log(labels);
            html.append(labels);
            html.append(control);
            $(this).replaceWith(html);
            if ( item.defaultValue ) {
                $(control).datepicker("update", item.defaultValue);
            }
            /*
             if (item.hasDatatype == "select") {
             var ds = DataSourcePool.getInstance().findById(item.datasource);
             ds.addEventListener("selectionChanged", function (event) {
             logger.log(event + " received");
             var row = ds.getCurrentRow();
             $("#" + item.id).val(row[item.field]);
             });
             }
             if (item.hasDatatype == "copy") {
             logger.log(item.id);
             $("#" + item.item).change(function (event) {
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