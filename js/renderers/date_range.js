/**
 * Created by fabio on 28/11/14.
 */
var dateRange = (function() {
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
            theItem.id = item.id + "_start";
            theItem.datatype = item.hasDatatype;
            theItem.datasource = item.datasource;
            theItem.path = item.start.hasPath;
            theItem.elementId = element.id;
            theItem.fixed = item.isFixed;
            theItem.useCode = item.useCode;
            theItem.useURN = item.useURN;
            theItem.outIndex = item.outIndex;
            theItem.isLanguageNeutral = item.isLanguageNeutral;
            theItem.query = ( item.hasValue ? item.hasValue.toString() : undefined );
            theElement.addItem(theItem);

            theItem = new Item();
            theItem.id = item.id + "_end";
            theItem.datatype = item.hasDatatype;
            theItem.datasource = item.datasource;
            theItem.path = item.end.hasPath;
            theItem.elementId = element.id;
            theItem.fixed = item.isFixed;
            theItem.useCode = item.useCode;
            theItem.useURN = item.useURN;
            theItem.outIndex = item.outIndex;
            theItem.isLanguageNeutral = item.isLanguageNeutral;
            theItem.query = ( item.hasValue ? item.hasValue.toString() : undefined );
            theElement.addItem(theItem);

            control = $(control);
            control2 = $(control2);

            control.attr("datatype", item.hasDatatype);
            control.attr("id", item.id + "_start");
            control.attr("querystringparameter", item.queryStringParameter);

            control2.attr("datatype", item.hasDatatype);
            control2.attr("id", item.id + "_end");
            control2.attr("querystringparameter", item.queryStringParameter);

            if (item.isFixed == "true") {
                control.val(item.hasValue);
                control.addClass("fixed");
                control2.val(item.hasValue);
                control2.addClass("fixed");
            }
            if (element.mandatory != "NA") {
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
            console.log(labels);
            $(labels2).addClass(defaults.labelCSS);
            console.log(labels2);
            html.append(labels);
            html.append(control);
            html.append(labels2);
            html.append(control2);
            $(this).replaceWith(html);

        });
    }
    function renderOld(div, item, element) {
        var control = undefined;
        var suffix = "";
        var id = div.attr("id") + "_" + item.hasIndex;

        var theElement = ediml.getElement(element.id);
        var theItem = new Item();
        theItem.id = id;
        theItem.datatype = item.hasDatatype;
        theItem.datasource = item.datasource;
        theItem.path = item.hasPath;
        theItem.elementId = element.id;
        theItem.fixed = item.isFixed;
        theItem.useCode = item.useCode;
        theItem.useURN = item.useURN;
        theItem.outIndex = item.outIndex;
        theItem.isLanguageNeutral = item.isLanguageNeutral;
        theElement.addItem(theItem);


        switch (item.hasDatatype) {
            case "select":
                control = $.parseHTML("<input type='text' class='form-control text-input'>");
                break;
            case "string":
                control = $.parseHTML("<input type='text' class='form-control text-input'>");
                break;
            case "URN":
                control = $.parseHTML("<input type='text' class='form-control urn-input'>");
                break;
            case "URI":
                control = $.parseHTML("<input type='text' class='form-control uri-input'>");
                break;
            case "int":
                control = $.parseHTML("<input type='number' step='1' class='form-control int-input'>");
                break;
            case "real":
            case "double":
                control = $.parseHTML("<input type='number' step='.0001' class='form-control double-input'>");
                break;
            case "text":
                control = $.parseHTML("<textarea class='form-control text-input'>");
                break;
            case "dependent":
                control = $.parseHTML("<input type='text' class='form-control dependent'>");
                $(control).attr("query", item.hasValue);
                break;
            case "ref":
                control = $.parseHTML("<input type='text' class='form-control ref'>");
                break;
            default:
                throw "unknown datatype";
        }
        if (typeof control !== "undefined") {
            control = $(control);
            var labels = $.parseHTML("<div class='labels'></div>");
            labels = $(labels);
            if (item.label) {
                for (var k = 0; k < item.label.length; k++) {
                    labels.append("<label for='" + id + "' class='form-label" + (item.label[k]["_xml:lang"] == settings.defaultLanguage ? "" : " hidden") + "' language='" + item.label[k]["_xml:lang"] + "'>" + item.label[k]["__text"] + "</label>");
                    if (item.label[k]["_xml:lang"] == settings.defaultLanguage) {
                        $(control).attr("placeholder", item.label[k]["__text"]);
                    }
                }
            }
            control.attr("id", id);
            control.attr("name", id);
            control.attr("datatype", item.hasDatatype);
            control.attr("path", item.hasPath);
            control.attr("hasValue", item.hasValue);
            control.attr("fixed", item.isFixed);
            control.attr("defaultValue", item.defaultValue);
            control.attr("isLanguageNeutral", item.isLanguageNeutral);
            control.attr("datasource", item.datasource);
            control.attr("ds", item.datasource);
            control.attr("show", item.show);
            control.attr("element_id", element.id);

            if (item.isFixed == "true") {
                control.val(item.hasValue);
                control.addClass("fixed");
            }
            if (element.mandatory != "NA") {
                control.attr("required", "required");
            }
            if (false && item.isFixed == "true") {
                control.attr("readonly", true);
                control.addClass("hidden");
            }
            var html = $.parseHTML("<div class='input-group col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
            html = $(html);
            html.append(labels);
            if (item.hasDatatype == "date") {
                console.log(control);
                control = $($.parseHTML('<div class="input-group date" data-date-format="yyyy-mm-dd">')).append(control);
                console.log(control);
                control.append('<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>');
                console.log(control);
            } else {
                control = $($.parseHTML("<div class='controls col-md-12'>")).append(control);
            }
            control.append(suffix);
            // html.append("<p class='controls'>").children("p").append(html).append(suffix);
            html.append(control);
            div.append(html);
            if (item.hasDatatype == "autoCompletion") {
                $("#" + id).removeAttr("hasValue");
                $("#" + id).removeAttr("path");
                $("#" + id).attr("datasource", item.datasource);
                $("#" + id).typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 3
                    },
                    {
                        name: "ds_" + div.attr("id") + "_" + item.hasIndex + "",
                        displayKey: 'l',
                        source: substringMatcher(item.datasource, id)
                    }).bind('typeahead:selected', function (obj, datum, name) {
                        $("#" + id + "_uri").val(datum.c).trigger("change");
                        $("#" + id + "_urn").val(datum.urn);
                        var ds = DataSourcePool.getInstance().findById(item.datasource);
                        ds.setCurrentRow("c", datum.c);
                    });
            }
            if (item.hasDatatype == "select") {
                var ds = DataSourcePool.getInstance().findById(item.datasource);
                ds.addEventListener("selectionChanged", function (event) {
                    console.log(event + " received");
                    var row = ds.getCurrentRow();
                    $("#" + id).val(row[item.field]);
                });
            }

        } else {
            div.append("undefined control");
        }
    }

    return {
        render: render
    };

})();
