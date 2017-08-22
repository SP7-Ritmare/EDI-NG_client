import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EdiItemComponent} from '../edi-item-component';
import {State} from '../../../model/State';
import point = L.point;
import {availableContexts, Logger} from '../../../utils/logger';
import {MetadataService} from '../../service/MetadataService';

@Component({
    selector: 'app-edi-bounding-box',
    templateUrl: './bounding-box.component.html',
    styleUrls: ['./bounding-box.component.css']
})
export class BoundingBoxComponent extends EdiItemComponent implements OnInit, AfterViewInit {
    static logger = new Logger(availableContexts.BBOX);
    interfaceLanguage: string;
    options: any;
    drawOptions: any;
    layersControl: any;
    map: any;
    drawnItems: any;

    north: number;
    south: number;
    east: number;
    west: number;

    ngAfterViewInit() {
        BoundingBoxComponent.logger.log('creating map');
        this.map = L.map('map', {
            zoom: 10,
            center: [44.987, 10.03]
        });
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(this.map);

        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);
        var drawControl = new L.Control.Draw({
            draw: {
                polygon: false,
                marker: false,
                polyline: false,
                circle: false
            },
            edit: {
                featureGroup: this.drawnItems,
                remove: false,
                edit: false
            }
        });
        this.map.addControl(drawControl);
        BoundingBoxComponent.logger.log('map created', this.map);
        this.map.on(L.Draw.Event.CREATED, (e: any) => {
            this.drawnItems.eachLayer( (layer: any) => {
                this.drawnItems.removeLayer(layer);
            })
            var type = e.layerType;
            var layer = e.layer;
            var bounds = e.layer.getBounds();

            BoundingBoxComponent.logger.log('event', e.layer.getBounds());
            this.item.southLatitude.value = bounds.getSouth();
            this.item.northLatitude.value = bounds.getNorth();
            this.item.eastLongitude.value = bounds.getEast();
            this.item.westLongitude.value = bounds.getWest();

            if (type === 'marker') {
                // Do marker specific actions
            }
            // Do whatever else you need to. (save to db; add to map etc)
            this.drawnItems.addLayer(layer);
        });
        this.map.on(L.Draw.Event.EDITSTOP, (e: any) => {
            var type = e.layerType;
            var layer = e.layer;
            var bounds = e.layer.getBounds();

            BoundingBoxComponent.logger.log('event', e.layer.getBounds());
            this.item.southLatitude.value = bounds.getSouth();
            this.item.northLatitude.value = bounds.getNorth();
            this.item.eastLongitude.value = bounds.getEast();
            this.item.westLongitude.value = bounds.getWest();

/*
            if (type === 'marker') {
                // Do marker specific actions
            }
            // Do whatever else you need to. (save to db; add to map etc)
            this.drawnItems.addLayer(layer);
*/
        });
        this.map.on(L.Draw.Event.DELETED, (e: any) => {
            // TODO: implement this
        });
        this.coordinateChange();
    }

    coordinateChange() {
        if (
            this.item.southLatitude.value &&
            this.item.northLatitude.value &&
            this.item.eastLongitude.value &&
            this.item.westLongitude.value
        ) {
            this.drawnItems.eachLayer( (layer: any) => {
                this.drawnItems.removeLayer(layer);
            })

            var bounds = L.latLngBounds(L.latLng(parseFloat(this.item.northLatitude.value), parseFloat(this.item.eastLongitude.value)), L.latLng(parseFloat(this.item.southLatitude.value), parseFloat(this.item.westLongitude.value)));

            // add rectangle passing bounds and some basic styles
            L.rectangle(bounds)  .addTo(this.drawnItems);
            this.map.fitBounds(bounds);
        }

    }

    onMapReady(map: L.Map) {
        // Do stuff with map
    }

    ngOnInit() {
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

        this.metadataService.state._interfaceLanguage.asObservable().subscribe(
            res => this.interfaceLanguage = res
        );
    }

}
