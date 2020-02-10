<template>
<v-ons-page>
    <v-ons-toolbar>
        <div class="center">Request Stream</div>
    </v-ons-toolbar>

    <div id="map" class="map"></div>
    <section id="nav_buttons" style="text-align: center;">

        <div style="display:block">
            <v-ons-button style="margin-top: 1em; width: 8em" @click="pushToViewStreamPage()">View Stream</v-ons-button>
        </div>
        <div style="display:block">
            <v-ons-button style="margin-top: 1em; width: 8em" @click="pushToSupplyStreamPage()">Supply Stream</v-ons-button>
        </div>
    </section>
</v-ons-page>
</template>

<style scoped>
@import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '../../node_modules/leaflet/dist/leaflet.css';
@import '../css/player.css';

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
    height: 60vh;
    width: 100vw;
}

#nav_buttons {
    height: 20vh;
}
</style>

<script>
import SupplyStream from '@/components/SupplyStream.vue'
import ViewStream from '@/components/ViewStream.vue'

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';


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
            }
        }
    },
    methods: {
        pushToViewStreamPage() {
            this.$emit('push-page', ViewStream);
        },
        pushToSupplyStreamPage() {
            this.$emit('push-page', SupplyStream);
        },
        onLocationFound(e) {
            var radius = e.accuracy;

            L.marker(e.latlng).addTo(this.map)
                //.bindPopup("You are within " + radius + " meters from this point").openPopup();

            L.circle(e.latlng, radius).addTo(this.map);
        },
        onLocationError(e) {
           this.$ons.notification.alert(e.message)

           this.map.setView([51.520748, -0.085040], 18)


        },
        initMap() {
            // this.map = L.map('map').setView([38.63, -90.23], 12);
            // this.tileLayer = L.tileLayer(
            //     'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
            //         maxZoom: 18,
            //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            //     }
            // );
            // this.tileLayer.addTo(this.map);

            this.map = L.map('map').fitWorld();

            this.map.locate({
                setView: true,
                maxZoom: 24
            });

        },
        initLayers() {

            this.tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWEwNnJpaSIsImEiOiJjazZkeTU2NnAxbWF4M2xxajN6NWIyb2l6In0.4iTjEpS8cIa_Um3zhE9keQ', {
                //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
