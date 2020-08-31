<template>
  <div class="wrapper">
    <p>First marker is placed at {{ withPopup.lat }}, {{ withPopup.lng }}</p>
    <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
    <button @click="showLongText">
      Toggle long popup
    </button>
    <button @click="showMap = !showMap">
      Toggle map
    </button>
    <l-map
      ref="myMap"
      @ready="mapsReady()"
      :zoom="zoom"
      :center="center"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker :lat-lng="withPopup">
        <l-popup>
          <div @click="innerClick">
            I am a popup
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="withTooltip">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click="innerClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
  import { latLng } from "leaflet";
  import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";

  export default {
    name: "Map",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LTooltip
    },
    data() {
      return {
        zoom: 13,
        center: latLng(47.41322, -1.219482),
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        withPopup: latLng(47.41322, -1.219482),
        withTooltip: latLng(47.41422, -1.250482),
        currentZoom: 11.5,
        currentCenter: latLng(47.41322, -1.219482),
        showParagraph: false,
        mapOptions: {
          zoomSnap: 0.5
        },
        showMap: true
      };
    },
    methods: {
      mapsReady() {
        this.map = this.$refs.myMap.mapObject;
      },
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },
      centerUpdate(center) {
        this.currentCenter = center;
      },
      showLongText() {
        this.showParagraph = !this.showParagraph;
      },
      innerClick() {
        alert("Click!");
      }
    }
  };
</script>

<style scoped></style>
