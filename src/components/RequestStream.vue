<template>
  <v-ons-page id="requestStreamPage">
    <!-- <my-elaborate-popup-content @push-page="testit" v-show="false" ref="foo"></my-elaborate-popup-content> -->

    <v-ons-list>
      <v-ons-list-item id="optionsPanel_section" expandable :expanded.sync="optionsPanelView">
        <span id="optionsPanel_section_title">request options</span>
        <div class="expandable-content">
          <div id="options_panel">
            <v-ons-row>
              <v-ons-col>
                <span class="optionsPanelRowTitle">Tags:</span>
                <!-- <span class="label-info">Street View</span> -->
                <span class="badge badge-pill badge-primary optionsPanelRow">Street View</span>
              </v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <v-ons-col>
                <span class="optionsPanelRowTitle">Will Accept:</span>
                <span class="optionsPanelRow">Side view of santa parade</span>
              </v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <v-ons-col>
                <span class="optionsPanelRowTitle">Tip Offered:</span>
                <span class="optionsPanelRow">$0.05/min</span>
              </v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <v-ons-col>
                <span class="optionsPanelRowTitle">Range:</span>
                <v-ons-range size="0.813em"></v-ons-range>
              </v-ons-col>
            </v-ons-row>
          </div>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <img id="vivid_logo" src="@/logo/Vivid_logo design2020-05.png" />
    <!-- <div id="map-container"> -->
    <div id="map" class="map"></div>
    <!-- </div> -->
    <section id="nav_buttons">
      <v-ons-list>
        <!-- <v-ons-list-item>
          <v-ons-row>
            <v-ons-col>
              <v-ons-range style="width: 100%;"></v-ons-range>
            </v-ons-col>
          </v-ons-row>
        </v-ons-list-item>-->
      </v-ons-list>
      <div id="pushToViewStreamPageButton">
        <v-ons-button @click="pushToViewStreamPage()">Send Video Request</v-ons-button>
      </div>
    </section>
  </v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../../node_modules/leaflet/dist/leaflet.css";
@import "../css/player.css";
@import "../../node_modules/leaflet-geosearch/assets/css/leaflet.css";
@import "../css/requestStream.css";
/* @import "../css/leafletmarkers/leaflet.extra-markers.min.css"; */
</style>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
//import $ from 'jquery'

// import "@/js/leaflet.extra-markers.js";

// import myElaboratePopupContent from "@/components/myElaboratePopupContent.vue";

import { GeoSearchControl, EsriProvider } from "leaflet-geosearch";
const myProvider = new EsriProvider();

export default {
  name: "requestStream",
  //   components: {
  //     myElaboratePopupContent
  //   },
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
      optionsPanelView: true,
      streamerIcon: null,
      redMarker: null
    };
  },
  methods: {
    pushToViewStreamPage() {
      this.$emit("push-page");
    },
    addIDEALondonMarker() {
      //const template = this.$refs.foo.$el.innerHTML;
      //Add Marker for IDEALondon location
      L.marker([51.520748, -0.08504])
        .addTo(this.map)
        .bindPopup("IEDALondon, London EC2A 2BB");

      L.circle([51.520748, -0.08504], this.defaultRadius).addTo(this.map);

      this.map.setView([51.520748, -0.08504], 15);
    },
    geoSearchEvent(_data) {
      if (this.myLocation) this.map.removeLayer(this.myLocation);
      if (this.myLocationCircle) this.map.removeLayer(this.myLocationCircle);

      if (this.geoSearchLocation) this.map.removeLayer(this.geoSearchLocation);
      if (this.geoSearchLocationCircle)
        this.map.removeLayer(this.geoSearchLocationCircle);

      this.geoSearchLocation = L.marker([_data.location.y, _data.location.x])
        .addTo(this.map)
        .bindPopup(_data.location.label)
        .openPopup();
      this.geoSearchLocationCircle = L.circle(
        [_data.location.y, _data.location.x],
        this.defaultRadius
      ).addTo(this.map);
      this.map.setView([_data.location.y, _data.location.x], 15);
    },
    onLocationFound(e) {
      var radius = e.accuracy;

      //   const icon = L.divIcon({
      //     className: "custom-div-icon",
      //     html:
      //       "<div style='background-color:#4838cc;' class='marker-pin'></div><i class='fa fa-camera awesome'>",
      //     iconSize: [30, 42],
      //     iconAnchor: [15, 42]
      //   });

      this.myLocation = L.marker(e.latlng)
        .addTo(this.map)
        .bindPopup("You are here")
        .openPopup();

      this.myLocationCircle = L.circle(e.latlng, radius).addTo(this.map);
    },
    onLocationError(e) {
      this.$ons.notification.alert(e.message);

      this.map.setView([51.520748, -0.08504], 15);
    },
    initMap() {
      this.map = L.map("map").setView([51.520748, -0.08504], 15);

      //   this.map.locate({
      //     setView: true,
      //     maxZoom: 20
      //   });

      //Add Marker for Idea London
      this.addIDEALondonMarker();

      new GeoSearchControl({
        provider: myProvider, // required
        showMarker: true, // optional: true|false  - default true
        showPopup: false, // optional: true|false  - default false
        marker: {
          // optional: L.Marker    - default L.Icon.Default
          icon: new L.Icon.Default(),
          draggable: false
        },
        // popupFormat: ({
        //     query,
        //     result
        // }) => result.label, // optional: function    - default returns result label
        maxMarkers: 1, // optional: number      - default 1
        retainZoomLevel: false, // optional: true|false  - default false
        animateZoom: true, // optional: true|false  - default true
        autoClose: true, // optional: true|false  - default false
        searchLabel: "Enter address", // optional: string      - default 'Enter address'
        keepResult: false
      }).addTo(this.map);

      this.map.on("geosearch/showlocation", this.geoSearchEvent);

      document.getElementById("optionsPanel_section").showExpansion();
    },
    initLayers() {
      this.tileLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWEwNnJpaSIsImEiOiJjazZkeTU2NnAxbWF4M2xxajN6NWIyb2l6In0.4iTjEpS8cIa_Um3zhE9keQ",
        {
          //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          attribution: false,
          maxZoom: 36,
          id: "mapbox/streets-v11"
        }
      ).addTo(this.map);
    },
    locationSuccess(pos) {
      var crd = pos.coords;

      console.log("Your current position is:");
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

    this.map.on("locationfound", this.onLocationFound);

    this.map.on("locationerror", this.onLocationError);

    // this.streamerIcon = L.icon({
    //   iconUrl: "my-icon.png",
    //   iconSize: [38, 95],
    //   iconAnchor: [22, 94],
    //   popupAnchor: [-3, -76],
    //   shadowUrl: "my-icon-shadow.png",
    //   shadowSize: [68, 95],
    //   shadowAnchor: [22, 94]
    // });
    // this.redMarker = L.ExtraMarkers.icon({
    //   icon: "fa-coffee",
    //   markerColor: "red",
    //   shape: "square",
    //   prefix: "fa"
    // });

    //this.addIDEALondonMarker();

    //navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, this.options);
  }
};
</script>
