<template>
  <div class="wrapper map">
    <div class="badges">
      Categories:
      <el-badge
        class="item"
        :value="category.value"
        v-for="(category, index) in categories"
        :key="'cat-' + index"
        type="primary"
      >
        <el-button
          size="small"
          @click="toggleFilter(category.name)"
          :type="filters.includes(category.name) ? 'primary' : 'plain'"
          :style="'border-color:' + category.color"
        >
          {{ category.name }}
        </el-button>
      </el-badge>
      <el-button
        size="small"
        v-if="filters.length > 0"
        type="danger"
        plain
        @click="filters = []"
      >
        Clear
      </el-button>
    </div>

    <div class="inside">
      <el-table :data="filteredList" height="100%">
        <el-table-column
          prop="name"
          :label="'Adresses (' + filteredList.length + ')'"
          width="200px"
        >
          <template slot-scope="scope">
            <span
              @click="center = scope.row.coordinates"
              v-html="scope.row.name"
            />
          </template>
        </el-table-column>
      </el-table>

      <l-map ref="myMap" @ready="mapsReady()" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution" />
        <l-marker
          :lat-lng="point.coordinates"
          v-for="(point, index) in filteredList"
          :key="index"
          :id="point.category"
          :icon="getIcon(categories.find(i => i.name === point.category).color)"
        >
          <l-icon-default class-name="someExtraClass" />
          <l-popup>
            <span v-html="point.name" />
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
  import { divIcon, latLng, latLngBounds } from "leaflet";
  import {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIconDefault
  } from "vue2-leaflet";

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
      LPopup,
      LIconDefault
    },
    data() {
      return {
        zoom: 13,
        center: latLng(0, 0),
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        mapOptions: {
          zoomSnap: 0.5
        },
        map: {},
        categories: [],
        filters: [],
        filteredList: []
      };
    },
    methods: {
      // Perform actions only if map element is ready
      mapsReady() {
        // Return to first step if there's no data to show;
        if (!this.$store.state.markers.length > 0) {
          this.$router.push("/");
          this.$store.commit("setProcessStep", 1);
          return;
        }
        this.map = this.$refs.myMap.mapObject;

        this.setMapBounds();

        this.getCategories();

        this.filteredMarkersList();
      },

      // Calculate bounds to show all markers
      setMapBounds() {
        const boundsMarkersArr = this.$store.state.markers.map(
          i => i.coordinates
        );
        const bounds = new latLngBounds(boundsMarkersArr);
        if (bounds) this.map.fitBounds(bounds);
      },

      getCategories() {
        // Select unique categories from dataset and count items per category
        this.unique(this.$store.state.markers.map(i => i.category)).forEach(
          i => {
            this.categories.push({
              name: i,
              value: this.$store.state.markers.filter(j => j.category === i)
                .length,
              color: this.getRandomColor()
            });
          }
        );
      },

      unique(arr) {
        return Array.from(new Set(arr));
      },

      // Toggle elements on filters list
      toggleFilter(filterString) {
        const index = this.filters.indexOf(filterString);
        if (index > -1) {
          this.filters.splice(index, 1);
        } else this.filters.push(filterString);
        this.filteredMarkersList();
      },

      // Updates list of markers to show
      filteredMarkersList() {
        // If there's no filters, show all elements
        if (!this.filters.length) this.filteredList = this.$store.state.markers;
        else
          this.filteredList = this.$store.state.markers.filter(j =>
            this.filters.includes(j.category)
          );
      },

      // Returns custom icon;
      getIcon(color) {
        return divIcon({
          className: "my-custom-pin",
          html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 34.892337" height="60" width="40">
    <g transform="translate(-814.59595,-274.38623)">
      <g transform="matrix(1.1855854,0,0,1.1855854,-151.17715,-57.3976)">
        <path d="m 817.11249,282.97118 c -1.25816,1.34277 -2.04623,3.29881 -2.01563,5.13867 0.0639,3.84476 1.79693,5.3002 4.56836,10.59179 0.99832,2.32851 2.04027,4.79237 3.03125,8.87305 0.13772,0.60193 0.27203,1.16104 0.33416,1.20948 0.0621,0.0485 0.19644,-0.51262 0.33416,-1.11455 0.99098,-4.08068 2.03293,-6.54258 3.03125,-8.87109 2.77143,-5.29159 4.50444,-6.74704 4.56836,-10.5918 0.0306,-1.83986 -0.75942,-3.79785 -2.01758,-5.14062 -1.43724,-1.53389 -3.60504,-2.66908 -5.91619,-2.71655 -2.31115,-0.0475 -4.4809,1.08773 -5.91814,2.62162 z" style="fill:${color};stroke:${color};"/>
        <circle r="3.0355" cy="288.25278" cx="823.03064" id="path3049" style="display:inline;fill:white;"/>
      </g>
    </g>
  </svg>`
        });
      },
      getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    }
  };
</script>

<style lang="scss">
  .map {
    height: 700px;

    .badges {
      display: flex;
      margin-bottom: 10px;
      justify-content: center;
      .el-button {
        margin-left: 2rem;
      }
    }
    .inside {
      width: 100%;
      height: 100%;
      align-items: center;
      display: flex;
      justify-content: space-between;

      .vue2leaflet-map {
        max-width: calc(100% - 250px);
        margin-left: 25px;
      }

      .el-table {
        height: 100%;
        display: block;

        .cell {
          cursor: pointer;
          user-select: none;
          span {
            word-break: keep-all;
          }
        }
      }
    }
  }
</style>
