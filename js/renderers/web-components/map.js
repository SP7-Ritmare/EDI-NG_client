const template = document.createElement('template')
template.innerHTML = `
    <link href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
    <style></style>
    <h1>
    Map
    </h1>
    <p>This is a map</p>
    <div id="map"></div>
    
`


class Map extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.width = 800
        this.height = 600
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // this.style = this.shadowRoot.querySelector('style')

        this.map = this.shadowRoot.getElementById('map')

        console.log('map', this.map)
        const map = new maplibregl.Map({
            container: this.map,
            center: [0, 0], // starting position [lng, lat]
            zoom: 1, // starting zoom
            trackResize: true,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap Contributors',
                        maxzoom: 19
                    },
/*
// Use a different source for terrain and hillshade layers, to improve render quality
                    terrainSource: {
                        type: 'raster-dem',
                        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                        tileSize: 256
                    },
                    hillshadeSource: {
                        type: 'raster-dem',
                        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                        tileSize: 256
                    }
*/
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm'
                    }/*,
                    {
                        id: 'hills',
                        type: 'hillshade',
                        source: 'hillshadeSource',
                        layout: {visibility: 'visible'},
                        paint: {'hillshade-shadow-color': '#473B24'}
                    }*/
                ]
            }
        });

        map.addControl(
            new maplibregl.NavigationControl()
        );

        /*
                map.addControl(
                    new maplibregl.TerrainControl({
                        source: 'terrainSource',
                        exaggeration: 1
                    })
                );
        */

        map.once('load', () => {
            map.resize();
        });
        // this.mapObject = map

        // console.log('map style', map.getStyle())
    }

    connectedCallback() {
        this.style = this.shadowRoot.querySelector('style')
    }

    static get observedAttributes() {
        return [
            'width',
            'height'
        ]
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attribute', name, 'changed', oldValue, newValue)
        if (name === 'width') {
            // this.width = newValue
            this.map.style.width = newValue + 'px'
            // this.mapObject.resize()
        } else if (name === 'height') {
            // this.height = newValue
            this.map.style.height = newValue + 'px'
            // this.mapObject.resize()
        }
    }
}

customElements.define("edi-map", Map);
