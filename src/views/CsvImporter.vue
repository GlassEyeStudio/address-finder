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
          this.locationObjects.forEach(i => {
            this.getDataFromExternalEndpoint(
              this.geoLocate(i.city, i.state, i.zipCode, i.address)
            ).then(response => {
              if (response.status === 200 && response.data && response.data[0])
                i.geo = {
                  lat: response.data[0].lat,
                  long: response.data[0].lon
                };
              else console.log("Couldn't find geolocation for: ", i);
            });
          });
        this.$store.commit('setPointsData', this.locationObjects);
        router.push("/map");
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
