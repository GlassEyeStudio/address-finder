<template>
  <div class="wrapper">
    <l-map ref="myMap" @ready="mapsReady()" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        :lat-lng="point.coordinates"
        v-for="(point, index) in $store.state.markers"
        :key="index"
      >
        <l-popup>
          <span v-html="point.displayName" />
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
  import { latLng, latLngBounds } from "leaflet";
  import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

  /* Missing markers fix */
  import { Icon } from "leaflet";

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
  });
  /* End of missing markers fix */

  export default {
    name: "Map",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup
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
        mapOptions: {
          zoomSnap: 0.5
        },
        showMap: true,
        markers: []
      };
    },
    methods: {
      mapsReady() {
        if (!this.$store.state.markers.length > 0) this.$router.push("/");
        this.map = this.$refs.myMap.mapObject;
        const boundsMarkersArr = this.$store.state.markers.map(
          i => i.coordinates
        );
        const bounds = new latLngBounds(boundsMarkersArr);
        this.map.fitBounds(bounds);
      }
    }
  };
</script>

<style scoped></style>
