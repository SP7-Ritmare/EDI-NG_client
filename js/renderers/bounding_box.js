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

            if ( item.CRSItem ) {
                $("#" + item.CRSItem).change(function() {

                });

                $(container).append("<div class='bboxMap map' id='map_" + theItem.id + "'></div>");
                var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
                html = $(html);
                var labels = $(this).find("label");
                $(labels).addClass(defaults.labelCSS);
                html.append(container);
                $(this).replaceWith(html);
                var view = new ol.View({
                    center: ol.proj.transform([9.18951, 45.46427], 'EPSG:4326', 'EPSG:3857'),
                    zoom: 4/* ,
                     extent: [11.0,43.0,13.0,46.0] */
                });
                var source = new ol.source.Vector();
                var vector = new ol.layer.Vector({
                    source: source,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    })
                });
                var map = new ol.Map({
                    target: 'map_' + theItem.id,
                    layers: [

                        new ol.layer.Tile({
                            source: new ol.source.MapQuest({layer: 'sat'})
                        }),
                        /*
                         new ol.layer.Tile({
                         source: new ol.source.OSM()
                         }),
                         */
                        vector
                    ],
                    view: view
                });
//Make sure your bounding box interaction variable is global
                var boundingBox;

//Place this after your map is instantiated
                boundingBox = new ol.interaction.DragBox({
                    condition: ol.events.condition.always,
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [255,255,0,1]
                        })
                    })
                });

                map.addInteraction(boundingBox);

                boundingBox.on('boxend', function(e){
                    var epsg = $("#" + item.CRSItem + " option:selected").text();
                    var extent = ol.proj.transform(boundingBox.getGeometry().getExtent(), 'EPSG:3857', 'EPSG:' + epsg);
                    console.log(extent);

                    // map.removeInteraction(boundingBox);
                })
            }

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