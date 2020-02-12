<template>
<v-ons-page>
    <v-ons-toolbar>
        <div class="center">Request Stream</div>
        <div class="right">
            <v-ons-button @click="pushToFilterStreamPage" class="right" style="background-color: Transparent;">
                <ons-icon style="color: black;" size="10px" icon="fa-filter"></ons-icon>
            </v-ons-button>
        </div>
    </v-ons-toolbar>
    <v-ons-list>
        <v-ons-list-item id="optionsPanel_section" expandable :expanded.sync="optionsPanelView">
            <span id="optionsPanel_section_title">options</span>
            <div class="expandable-content ">
                <div id="options_panel" class="phaedra-colors">
                    <v-ons-row>
                        <v-ons-col>
                            Tags:
                            <span class="label-info">Street View</span>

                        </v-ons-col>
                    </v-ons-row>
                    <v-ons-row>
                        <v-ons-col>
                            Will Accept:
                            <span>People looking for the items</span>
                        </v-ons-col>
                    </v-ons-row>
                    <v-ons-row>
                        <v-ons-col>
                            Tip Offered:
                            <span>$0.05/min</span>
                        </v-ons-col>
                    </v-ons-row>
                </div>
            </div>
        </v-ons-list-item>
    </v-ons-list>

    <div id="map" class="map"></div>

    <section id="nav_buttons" style="text-align: center;">
        <v-ons-list>
            <v-ons-list-item>
                <!-- Adjust the range size: -->
                <v-ons-row>
                    <v-ons-col>
                        <v-ons-range style="width: 100%;"></v-ons-range>
                    </v-ons-col>
                </v-ons-row>
                <!-- Volume: {{ volume }} <span v-show="Number(volume) > 80">&nbsp;(careful, that's loud)</span> -->
            </v-ons-list-item>
        </v-ons-list>
        <div style="display:block">
            <v-ons-button style="margin-top: 1em; width: 8em" @click="pushToViewStreamPage()">Send Request</v-ons-button>
        </div>
    </section>
</v-ons-page>
</template>

<style scoped>
@import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '../../node_modules/leaflet/dist/leaflet.css';
@import '../css/player.css';
@import '../../node_modules/leaflet-geosearch/assets/css/leaflet.css';
@import '../css/labelColors.css';

video {
    width: 100%;
    max-width: 640px;
    max-height: 400px;
}

body {
    padding: 0;
    margin: 0;
}

html,
body,
#map {
    height: 35vh;
    width: 100vw;
}

#nav_buttons {
    height: 20vh;
}

#optionsPanel_section_title {
    font-variant: small-caps;
    font-size: 14px;
    font-weight: 500;
}

#optionsPanel_section {
    background-color: #eee;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top;
}

#options_panel {
    background-color: #ebf4f4;
}

#options_panel {
    font-weight: 500;
    /* color:purple; */
    color: navy;
}

#options_panel span {
    font-size: 12px;
    font-weight: 400;
    margin-right: 0.5em;
    /* color:navy; */
    color: indigo;
}


</style>

<script>
import SupplyStream from '@/components/SupplyStream.vue'
import ViewStream from '@/components/ViewStream.vue'
import RequestStreamFilters from '@/components/RequestStreamFilters.vue'

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

//import 'bootstrap'

import {
    GeoSearchControl,
    EsriProvider
} from 'leaflet-geosearch';
const myProvider = new EsriProvider();

export default {
    name: 'requestStream',
    data() {
        return {
            map: null,
            tileLayer: null,
            layers: [],
            options: {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            },
            myLocation: null,
            myLocationCircle: null,
            geoSearchLocation: null,
            geoSearchLocationCircle: null,
            defaultRadius: 92,
            optionsPanelView: true
        }
    },
    methods: {
        pushToViewStreamPage() {
            this.$emit('push-page', ViewStream);
        },
        pushToSupplyStreamPage() {
            this.$emit('push-page', SupplyStream);
        },
        pushToFilterStreamPage() {
            this.$emit('push-page', {
                extends: RequestStreamFilters,
                onsNavigatorOptions: {
                    animation: 'lift',
                    animationOptions: {
                        duration: 0.5
                    }
                }
            });
        },
        geoSearchEvent(_data) {
            console.log(_data)
            console.log(arguments)

            if (this.myLocation) this.map.removeLayer(this.myLocation);
            if (this.myLocationCircle) this.map.removeLayer(this.myLocationCircle);

            if (this.geoSearchLocation) this.map.removeLayer(this.geoSearchLocation);
            if (this.geoSearchLocationCircle) this.map.removeLayer(this.geoSearchLocationCircle);

            this.geoSearchLocation = L.marker([_data.location.y, _data.location.x]).addTo(this.map)
            this.geoSearchLocationCircle = L.circle([_data.location.y, _data.location.x], this.defaultRadius).addTo(this.map)
            this.map.setView([_data.location.y, _data.location.x], 15);

        },
        onLocationFound(e) {
            var radius = e.accuracy;

            this.myLocation = L.marker(e.latlng).addTo(this.map)
            //.bindPopup("You are within " + radius + " meters from this point").openPopup();

            this.myLocationCircle = L.circle(e.latlng, radius).addTo(this.map);
        },
        onLocationError(e) {
            this.$ons.notification.alert(e.message)

            this.map.setView([51.520748, -0.085040], 15)

        },
        initMap() {

            console.log(L)

            // this.map = L.map('map').setView([38.63, -90.23], 12);
            // this.tileLayer = L.tileLayer(
            //     'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
            //         maxZoom: 18,
            //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            //     }
            // );
            // this.tileLayer.addTo(this.map);

            this.map = L.map('map').setView([51.520748, -0.085040], 15);

            this.map.locate({
                setView: true,
                maxZoom: 20
            });

            new GeoSearchControl({
                provider: myProvider, // required
                showMarker: true, // optional: true|false  - default true
                showPopup: false, // optional: true|false  - default false
                marker: { // optional: L.Marker    - default L.Icon.Default
                    icon: new L.Icon.Default(),
                    draggable: false,
                },
                // popupFormat: ({
                //     query,
                //     result
                // }) => result.label, // optional: function    - default returns result label
                maxMarkers: 1, // optional: number      - default 1
                retainZoomLevel: false, // optional: true|false  - default false
                animateZoom: true, // optional: true|false  - default true
                autoClose: true, // optional: true|false  - default false
                searchLabel: 'Enter address', // optional: string      - default 'Enter address'
                keepResult: false
            }).addTo(this.map);

            this.map.on('geosearch/showlocation', this.geoSearchEvent)

            document.getElementById('optionsPanel_section').showExpansion();

        },
        initLayers() {

            this.tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWEwNnJpaSIsImEiOiJjazZkeTU2NnAxbWF4M2xxajN6NWIyb2l6In0.4iTjEpS8cIa_Um3zhE9keQ', {
                //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                attribution: false,
                maxZoom: 36,
                id: 'mapbox/streets-v11'
            }).addTo(this.map);
        },
        locationSuccess(pos) {
            var crd = pos.coords;

            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
        },

        locationError(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
    },
    mounted() {
        this.initMap();
        this.initLayers();

        this.map.on('locationfound', this.onLocationFound);

        this.map.on('locationerror', this.onLocationError);

        // var options = {
        //     enableHighAccuracy: true,
        //     timeout: 5000,
        //     maximumAge: 0
        // };

        // function success(pos) {
        //     var crd = pos.coords;

        //     console.log('Your current position is:');
        //     console.log(`Latitude : ${crd.latitude}`);
        //     console.log(`Longitude: ${crd.longitude}`);
        //     console.log(`More or less ${crd.accuracy} meters.`);
        // }

        // function error(err) {
        //     console.warn(`ERROR(${err.code}): ${err.message}`);
        // }

        //navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, this.options);
    }
}
</script>
