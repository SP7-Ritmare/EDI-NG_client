/**
 * Created by fabio on 28/11/14.
 */
var boundingBox = (function() {
    function render() {
        var control;
        $("control_boundingbox").each(function() {
            var temp = edi.getTempStructure()[$(this).attr("id")];
            var element = temp.element;
            var item = temp.item;
            var components = ["westLongitude", "eastLongitude", "northLatitude", "southLatitude"];
            var theElement = ediml.getElement(element.id);
            var theItem;
            var subItem;
            var container = $.parseHTML("<div class='boundingBox'>");
            var coordinate;

            for ( var i = 0; i < components.length; i++ ) {
                subItem = item[components[i]];
                coordinate = $.parseHTML("<div class='bbox_coord'>");
                $(coordinate).addClass("box_" + components[i]);
                control = $.parseHTML("<input type='text' class='" + defaults.controlCSS + " " + item.hasDatatype + "-input'>");

                theItem = new Item();
                theItem.id = item.id + "_" + components[i];
                theItem.datatype = item.hasDatatype;
                theItem.datasource = item.datasource;
                theItem.path = subItem.hasPath;
                theItem.elementId = element.id;
                theItem.fixed = item.isFixed;
                theItem.useCode = item.useCode;
                theItem.useURN = item.useURN;
                theItem.outIndex = subItem.outIndex;
                theItem.itemId = item.itemId;
                theItem.show = item.show;
                theItem.field = subItem.field;
                theItem.isLanguageNeutral = item.isLanguageNeutral;
                theItem.query = ( item.hasValue ? item.hasValue.toString() : undefined );
                theElement.addItem(theItem);

                control = $(control);

                control.attr("datatype", item.hasDatatype);
                control.attr("datasource", item.datasource);
                control.attr("show", item.show);
                control.attr("id", theItem.id);
                control.attr("querystringparameter", subItem.queryStringParameter);
                if (item.isFixed == "true") {
                    control.val(item.hasValue);
                    control.addClass("fixed");
                }
                if (element.isMandatory != "NA") {
                    control.attr("required", "required");
                }
                control.addClass(components[i]);

                for ( var j = 0; j < subItem.label.length; j++ ) {
                    $(coordinate).append("<label for='" + theItem.id + "' class='" + defaults.labelCSS + "' language='" + subItem.label[j]["_xml:lang"] + "'>" + subItem.label[j]["__text"] + "</label>")
                }
                $(coordinate).append(control);
                $(container).append(coordinate);
            }
            var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
            html = $(html);
            var labels = $(this).find("label");
            $(labels).addClass(defaults.labelCSS);
            html.append(container);
            $(this).replaceWith(html);
            /*
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