<template>
  <div class="wrapper">
    <vue-csv-import
      v-model="locationObjects"
      :autoMatchFields="true"
      :autoMatchIgnoreCase="true"
      :map-fields="{
        city: 'City',
        state: 'State',
        zipCode: 'Zip-code',
        address: 'Address',
        category: 'Category'
      }"
    >
      <template slot="hasHeaders" slot-scope="{ headers, toggle }">
        <label>
          <input
            type="checkbox"
            id="hasHeaders"
            :value="headers"
            @change="toggle"
          />
          Headers?
        </label>
      </template>

      <template slot="thead">
        <tr>
          <th>My Fields</th>
          <th>Column</th>
        </tr>
      </template>

      <template slot="next" slot-scope="{ load }">
        <button @click.prevent="load">load!</button>
      </template>
    </vue-csv-import>
    <button @click.prevent="findGeoPoints">send!</button>
  </div>
</template>

<script>
  import { VueCsvImport } from "vue-csv-import";
  import router from "@/router";
  import { latLng } from "leaflet";

  export default {
    name: "CsvImporter",
    components: { VueCsvImport },
    data() {
      return {
        locationObjects: []
      };
    },
    methods: {
      findGeoPoints() {
        if (this.locationObjects)
          for (let i = 0; i < this.locationObjects.length; i++) {
            let location = this.locationObjects[i];
            this.getDataFromExternalEndpoint(
              this.geoLocate(
                location.city,
                location.state,
                location.zipCode,
                location.address
              )
            ).then(response => {
              if (
                response.status === 200 &&
                response.data &&
                response.data[0]
              ) {
                location.geo = {
                  lat: response.data[0].lat,
                  long: response.data[0].lon
                };
                location.displayName = response.data[0].display_name;
              } else console.log("Couldn't find geolocation for: ", location);

              if (i === this.locationObjects.length - 1) {
                const markers = [];
                this.locationObjects.forEach(i => {
                  if (i.geo != null)
                    markers.push({
                      coordinates: latLng(i.geo.lat, i.geo.long),
                      name: i.displayName
                    });
                });
                this.$store.commit("setPointsData", markers);
                this.$nextTick(() => {
                  router.push("/map");
                });
              }
            });
          }
      },

      geoLocate(city, state, zipcode, address) {
        return `https://nominatim.openstreetmap.org/search?city=${city}&state${state}&postalcode=${zipcode}&street=${address}&format=json`;
      },

      getDataFromExternalEndpoint(endpoint) {
        return this.axios
          .get(endpoint)
          .then(response => {
            return response;
          })
          .catch(error => {
            return error.response;
          });
      }
    }
  };
</script>

<style scoped></style>
