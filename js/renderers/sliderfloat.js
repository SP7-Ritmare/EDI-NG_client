/**
 * Boolean renderer<br>
 * It compiles all <control_date> tags that have been inserted into HTML, and turns them into <input type="text">s<br>
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */

class SliderFloat {
    static render() {
        const logger = new Logger(availableContexts.SLIDER_FLOAT);

        console.log('slider float rendering')
        const allSliderFloats = document.querySelectorAll('control_sliderfloat')
        const tempStruct = edi.getTempStructure()
        $("control_sliderfloat").each(function () {
            console.log('slider', $(this))
            console.log('slider', $(this).attr('id'))
            console.log('slider', tempStruct[$(this).attr('id')])

            const temp = tempStruct[$(this).attr('id')]
            var element = temp.element;
            var item = temp.item;
            console.log('slider item start', item)
            /*
                        let control = $.parseHTML(`
                        <div id="${item.id}"

                                ${item.hasDatatype}-input

                                >
                            <div class="row">
                                <div class="col-md-12 text-center currentValue">${item.value}</div>
                            </div>
                            <div class="row">
                                <div class="col-md-2 start">${item.min}</div>
                                <div class="col-md-8 center-block in">
                                    <input class="${defaults.controlCSS}" type="range" min="${item.min}" max="${item.max}" step="${item.step}">
                                </div>
                                <div class="col-md-2 end">${item.max}</div>
                            </div>
                        </div>
                            `)
            */
            let control = $.parseHTML(`
                <edi-float-slider
                    id="${item.id}"
                    ${item.hasDatatype}-input
                    min="${item.min}"
                    max="${item.max}"
                    step="${item.step}"
                ></edi-float-slider
                >`)


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
            control.attr("defaultValue", item.defaultValue);
            control.attr("field", item.field);
            control.attr("querystringparameter", item.queryStringParameter);
            control.attr('value', item.hasValue);
            if (item.isFixed == "true") {
                control.attr('value', item.hasValue);
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
            if ( item.show != "hidden" ) {
                html.append(labels);
            }
            html.append(control);
            $(this).replaceWith(html);
        })
    }
}
/*
var Boolean = (function() {
    var logger = new Logger(availableContexts.BOOLEAN);
    /!**
     *
     * @memberOf Textbox
     *!/
    function render() {
        var control;
        $("control_boolean").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;

            if ( item.hasDatatype == "text" ) {
                control = $.parseHTML("<textarea class='" + defaults.controlCSS + " " + item.hasDatatype + "-input'>");
            } else {
                control = $.parseHTML("<input type='checkbox' class='" + defaults.controlCSS + " " + item.hasDatatype + "-input'>");
            }
            if ( item.show == "hidden" || item.hasDatatype == "autonumber" ) {
                $(control).attr("type", "hidden");
            }
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
            if ( item.show != "hidden" ) {
                html.append(labels);
            }
            html.append(control);
            $(this).replaceWith(html);
            /!*
             if (item.hasDatatype == "copy") {
             logger.log(item.id);
             $("#" + item.itemId).change(function (event) {
             logger.log(event + " received");
             $("#" + item.id).val($(this).val()).trigger("change");
             });
             }
             *!/

        });
    }
    return {
        render: render
    };

})();
*/
