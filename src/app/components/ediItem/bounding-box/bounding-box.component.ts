import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EdiItemComponent} from '../edi-item-component';

@Component({
    selector: 'app-edi-bounding-box',
    templateUrl: './bounding-box.component.html',
    styleUrls: ['./bounding-box.component.css']
})
export class BoundingBoxComponent extends EdiItemComponent implements OnInit, AfterViewInit {
    options: any;
    drawOptions: any;
    layersControl: any;
    map: any;

    north: number;
    south: number;
    east: number;
    west: number;

    constructor() {
        super();
        this.options = {
            layers: [
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
            ],
            zoom: 5,
            center: L.latLng({lat: 38.991709, lng: -76.886109})
        };
        this.layersControl = {
            baseLayers: {
                'layerName': L.Layer
            },
            overlays: {
                'overlayName': L.Layer
            }
        }
        this.drawOptions = {
            position: 'topright',
            draw: {
                marker: {
                    icon: L.icon({
                        iconUrl: '2273e3d8ad9264b7daa5bdbf8e6b47f8.png',
                        shadowUrl: '44a526eed258222515aa21eaffd14a96.png'
                    })
                },
                polyline: false,
                circle: {
                    shapeOptions: {
                        color: '#aaaaaa'
                    }
                }
            }
        };




    }

    ngAfterViewInit() {
        console.log('creating map');
        this.map = L.map('map', {
            zoom: 10,
            center: [44.987, 10.03]
        });
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(this.map);

        var drawnItems = new L.FeatureGroup();
        this.map.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            draw: {
                polygon: false,
                marker: false,
                polyline: false,
                circle: false
            },
            edit: {
                featureGroup: drawnItems
            }
        });
        this.map.addControl(drawControl);
        console.log('map created', this.map);
        this.map.on(L.Draw.Event.CREATED, (e: any) => {
            var type = e.layerType;
            var layer = e.layer;
            var bounds = e.layer.getBounds();

            console.log('event', e.layer.getBounds());
            this.item.southLatitude.value = bounds.getSouth();
            this.item.northLatitude.value = bounds.getNorth();
            this.item.eastLongitude.value = bounds.getEast();
            this.item.westLongitude.value = bounds.getWest();

            if (type === 'marker') {
                // Do marker specific actions
            }
            // Do whatever else you need to. (save to db; add to map etc)
            drawnItems.addLayer(layer);
        });
        this.map.on(L.Draw.Event.EDITED, (e: any) => {
            var type = e.layerType;
            var layer = e.layer;
            var bounds = e.layer.getBounds();

            console.log('event', e.layer.getBounds());
            this.item.southLatitude.value = bounds.getSouth();
            this.item.northLatitude.value = bounds.getNorth();
            this.item.eastLongitude.value = bounds.getEast();
            this.item.westLongitude.value = bounds.getWest();

            if (type === 'marker') {
                // Do marker specific actions
            }
            // Do whatever else you need to. (save to db; add to map etc)
            drawnItems.addLayer(layer);
        });
        this.map.on(L.Draw.Event.DELETED, (e: any) => {
            // TODO: implement this
        });
    }

    onMapReady(map: L.Map) {
        // Do stuff with map
    }

    ngOnInit() {
    }

}
