/**
 * BoundingBox renderer<br>
 * It compiles all <control_boundingbox> tags that have been inserted into HTML, and turns them into 4-ples of text boxes for the coordinates, plus an OpenLayers map<br>
 * The map only shows the bounding box on map if <isFixed> is true<br>
 * On the other hand, if <isFixed> is false, the map can be used to draw the bounding box
 *
 * @author  Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */
var BoundingBox = (function() {
    var logger = new Logger(availableContexts.BBOX);
    var maps = [];
//Make sure your bounding box interaction variable is global
    var boundingBox;


    function drawBoxOnMap(map, source, extent, epsg) {
        if ( typeof epsg !== "undefined" ) {
            extent = ol.proj.transformExtent(extent, 'EPSG:' + epsg, 'EPSG:3857');
        }
        logger.log("drawBoxOnMap");
        logger.log(map);
        var features = source.getFeatures();
        logger.log(features);
        for ( var i = 0; i < features.length; i++ ) {
            source.removeFeature(features[i]);
        }
        var rectangleObject = {
            "type":"Polygon",
            "coordinates":[
                [
                    // SW
                    [ extent[0], extent[1] ],
                    // SE
                    [ extent[2], extent[1] ],
                    // NE
                    [ extent[2], extent[3] ],
                    // NW
                    [ extent[0], extent[3] ]
                ]
            ]
        };
        var rectangleFeature = new ol.Feature({
            geometry: new ol.geom.Polygon(rectangleObject.coordinates),
            name: "bounding box"
        });
        rectangleFeature.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 151, 0, 0.2)',
                weight: 10
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 151, 0, 0.6)',
                width: 3
            }) /*,
             text: new ol.style.Text({
             font: '12px Calibri,sans-serif',
             text: 'Bounding Box',
             textBaseline: 'middle',
             textAlign: 'center',
             fill: new ol.style.Fill({
             color: '#000'
             }),
             stroke: new ol.style.Stroke({
             color: '#fff',
             width: 3
             })
             })*/
        }));

        logger.log(3);

        source.addFeature(rectangleFeature);
        map.getView().fitExtent(extent, map.getSize());
        logger.log(4);

    }

    /**
     *
     * @memberOf BoundingBox
     */
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

                ItemRenderer.copyAttributesFrom(element, item, theItem);

                theItem.path = subItem.hasPath;
                theItem.outIndex = subItem.outIndex;
                theItem.field = subItem.field;
                theElement.addItem(theItem);

                control = $(control);

                control.attr("datatype", item.hasDatatype);
                control.attr("datasource", item.datasource);
                control.attr("show", item.show);
                control.attr("id", theItem.id);
                control.attr("querystringparameter", subItem.queryStringParameter);
                if (theItem.isFixed == "true") {
                    control.val(item.hasValue);
                    $(coordinate).addClass("fixed");
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

            if ( true ||  item.CRSItem ) {
/*
                $("#" + item.CRSItem).change(function() {

                });
*/
                PanDragControl = function(opt_options) {

                    var options = opt_options || {};

                    var anchor = document.createElement('a');
                    anchor.href = '#pan-draw';
                    anchor.innerHTML = "<span class='active-mode'>Pan</span>/<span class='inactive-mode'>Draw</span>";

                    var this_ = this;
                    var handleRotateNorth = function(e) {
                        // prevent #rotate-north anchor from getting appended to the url
                        e.preventDefault();
                        var button = $(".pan-draw");
                        if ( button.hasClass("mode-draw") ) {
                            this_.getMap().removeInteraction(boundingBox);
                            button.find("a").html("<span class='active-mode'>Pan</span>/<span class='inactive-mode'>Draw</span>");
                            button.addClass("mode-pan");
                            button.removeClass("mode-draw");
                        } else {
                            this_.getMap().addInteraction(boundingBox);
                            button.find("a").html("<span class='inactive-mode'>Pan</span>/<span class='active-mode'>Draw</span>");
                            button.addClass("mode-draw");
                            button.removeClass("mode-pan");
                        }
                    };

                    anchor.addEventListener('click', handleRotateNorth, false);
                    anchor.addEventListener('touchstart', handleRotateNorth, false);

                    var element = document.createElement('div');
                    element.className = 'pan-draw ol-unselectable mode-pan';
                    element.appendChild(anchor);

                    ol.control.Control.call(this, {
                        element: element,
                        target: options.target
                    });

                };
                ol.inherits(PanDragControl, ol.control.Control);

                $(container).append("<div class='bboxMap map' id='map_" + theItem.id + "'></div>");
                var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
                html = $(html);
                var labels = $(this).find("label");
                $(labels).addClass(defaults.labelCSS);
                html.append(container);
                $(this).replaceWith(html);
                var view = new ol.View({
                    projection: 'EPSG:3857',
                    /* center: ol.proj.transform([9.18951, 45.46427], 'EPSG:4326', 'EPSG:3857'), */
                    center: [0, 0],
                    zoom: 2 /* ,
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
                    controls: ol.control.defaults({
                        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                            collapsible: false
                        })
                    }).extend([
                        new PanDragControl()
                    ]),
                    layers: [


                        new ol.layer.Tile({
                            source: new ol.source.MapQuest({layer: 'osm'})
                        }),
                        /*
                        new ol.layer.Tile({
                             source: new ol.source.BingMaps({
                             key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
                             imagerySet: 'AerialWithLabels'
                             // use maxZoom 19 to see stretched tiles instead of the BingMaps
                             // "no photos at this zoom level" tiles
                             // maxZoom: 19
                             })
                        }),
                         new ol.layer.Tile({
                            source: new ol.source.OSM(),
                             opacity: 1.0
                         }),
                         */
                        vector
                    ],
                    view: view
                });
                maps.push(map);
//Place this after your map is instantiated
                boundingBox = new ol.interaction.DragBox({
                    condition: ol.events.condition.always,
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [255,255,0,1]
                        })
                    })
                });

                if (item.isFixed == "false") {
                    $("#" + 'map_' + theItem.id).prepend("<span class='oppure'>" + localise("OR") + "</span>");
                    // map.addInteraction(boundingBox);
                }

                // map.removeInteraction(boundingBox);

                boundingBox.on('boxend', function(e){
                    var epsg = "4326"; // $("#" + item.CRSItem + " option:selected").text();
                    var box = boundingBox.getGeometry().getExtent();
                    var extent = ol.proj.transformExtent(box, 'EPSG:3857', 'EPSG:' + epsg);
                    map.getView().fitExtent(box, map.getSize());
                    logger.log(epsg);
                    logger.log(box);
                    logger.log(extent);
                    logger.log(item.id);
                    $("#" + item.id + "_westLongitude").val(extent[0]).trigger("change");
                    $("#" + item.id + "_southLatitude").val(extent[1]).trigger("change");
                    $("#" + item.id + "_eastLongitude").val(extent[2]).trigger("change");
                    $("#" + item.id + "_northLatitude").val(extent[3]).trigger("change");

                    drawBoxOnMap(map, source, box);
/*
                    var rectangleObject = {
                        "type":"Polygon",
                        "coordinates": [
                            [
                                // SW
                                [ extent[0], extent[1] ],
                                // SE
                                [ extent[2], extent[1] ],
                                // NE
                                [ extent[2], extent[3] ],
                                // NW
                                [ extent[0], extent[3] ]
                            ]
                        ]
                    };
                    source.addFeature(new ol.geom.LineString(rectangleObject.coordinates));
*/
                    // map.removeInteraction(boundingBox);
                })
                function updateBox() {
                    logger.log("updateBox");
                    var epsg = "4326"; // $("#" + item.CRSItem + " option:selected").text();
                    logger.log(epsg);
                    var extent = [
                        parseFloat($("#" + item.id + "_westLongitude").val()),
                        parseFloat($("#" + item.id + "_southLatitude").val()),
                        parseFloat($("#" + item.id + "_eastLongitude").val()),
                        parseFloat($("#" + item.id + "_northLatitude").val())
                    ];
                    var allNumbers = true;
                    for ( var i = 0; i < extent.length; i++ ) {
                        if ( isNaN(extent[i]) ) {
                            allNumbers = false;
                        }
                    }
                    logger.log(allNumbers);
                    logger.log(epsg);
                    if ( !epsg ) {
                        epsg = "4326";
                    }
                    if ( allNumbers && epsg ) {
                        try {
                            drawBoxOnMap(map, source, extent, epsg);
                        } catch (e) {

                        }
                    }
                }
                $("#" + item.id + "_westLongitude").change(updateBox).trigger("change");
                $("#" + item.id + "_southLatitude").change(updateBox).trigger("change");
                $("#" + item.id + "_eastLongitude").change(updateBox).trigger("change");
                $("#" + item.id + "_northLatitude").change(updateBox).trigger("change");
            } else {
                var html = $.parseHTML("<div class='" + defaults.controlGroupCSS + " col-md-12" + ( item.hasDatatype == "date" ? " date" : "" ) + "'>");
                html = $(html);
                var labels = $(this).find("label");
                $(labels).addClass(defaults.labelCSS);
                html.append(container);
                $(this).replaceWith(html);

            }

            /*
            if (item.hasDatatype == "copy") {
                logger.log(item.id);
                $("#" + item.itemId).change(function (event) {
                    logger.log(event + " received");
                    $("#" + item.id).val($(this).val()).trigger("change");
                });
            }
            */

        });
    }
    return {
        maps: maps,
        render: render
    };

})();