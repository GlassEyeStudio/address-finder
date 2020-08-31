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
        >
          <l-popup>
            <span v-html="point.name" />
          </l-popup>
        </l-marker>
      </l-map>
    </div>
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
      mapsReady() {
        if (!this.$store.state.markers.length > 0) {
          this.$router.push("/");
          return;
        }
        this.map = this.$refs.myMap.mapObject;

        this.setMapBounds();

        this.getCategories();

        this.filteredMarkersList();
      },

      setMapBounds() {
        const boundsMarkersArr = this.$store.state.markers.map(
          i => i.coordinates
        );
        const bounds = new latLngBounds(boundsMarkersArr);
        if (bounds) this.map.fitBounds(bounds);
      },

      getCategories() {
        this.unique(this.$store.state.markers.map(i => i.category)).forEach(
          i => {
            this.categories.push({
              name: i,
              value: this.$store.state.markers.filter(j => j.category === i)
                .length
            });
          }
        );
      },

      unique(arr) {
        return Array.from(new Set(arr));
      },

      toggleFilter(filterString) {
        const index = this.filters.indexOf(filterString);
        if (index > -1) {
          this.filters.splice(index, 1);
        } else this.filters.push(filterString);
        this.filteredMarkersList();
      },

      filteredMarkersList() {
        if (!this.filters.length) this.filteredList = this.$store.state.markers;
        else
          this.filteredList = this.$store.state.markers.filter(j =>
            this.filters.includes(j.category)
          );
      }
    },
    watch: {}
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
