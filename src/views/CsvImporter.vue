<template>
  <div class="wrapper   ">
    <div class="importForm">
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
        url="/"
        :finally="findGeoPoints"
        v-if="$store.state.processStep === 1"
      >
        <template slot="hasHeaders" slot-scope="{ headers, toggle }">
          <el-checkbox :value="headers" @change="toggle" border>
            File contains headers
          </el-checkbox>
        </template>

        <template slot="thead">
          <tr>
            <th>My Fields</th>
            <th>Column</th>
          </tr>
        </template>

        <template slot="next" slot-scope="{ load }">
          <el-button type="primary" round @click.prevent="load"
            >Upload</el-button
          >
        </template>

        <template slot="submit" slot-scope="{ submit }">
          <el-button type="primary" round @click.prevent="submit">
            Submit
          </el-button>
        </template>
      </vue-csv-import>
      <el-progress
        type="circle"
        :percentage="parsingProgress"
        v-if="$store.state.processStep === 2"
      />
    </div>
    <span class="instruction" v-if="$store.state.processStep === 1">
      Your CSV file should contain columns with data about the city, state, zip
      code, address, and category. You can use files with more data, you will
      select columns to use in the search.
    </span>
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
        parsingProgress: 0,
        locationObjects: [],
        fileList: []
      };
    },
    methods: {
      findGeoPoints() {
        if (this.locationObjects) this.$store.commit("setProcessStep", 2);
        let counter = 0;
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
            if (response.status === 200 && response.data && response.data[0]) {
              location.geo = {
                lat: response.data[0].lat,
                long: response.data[0].lon
              };
              location.displayName = response.data[0].display_name;
            } else console.log("Couldn't find geolocation for: ", location);

            counter++;

            if (counter === this.locationObjects.length) {
              const markers = [];
              this.locationObjects.forEach(i => {
                if (i.geo != null)
                  markers.push({
                    coordinates: latLng(i.geo.lat, i.geo.long),
                    name: i.displayName,
                    category: i.category
                  });
              });
              this.$store.commit("setPointsData", markers);
              this.$nextTick(() => {
                this.$store.commit("setProcessStep", 3);
                router.push("/map");
              });
            }
            this.parsingProgress = Math.round(
              (counter / this.locationObjects.length) * 100
            );
          });
        }
      },

      geoLocate(city, state, zipcode, address) {
        return `https://nominatim.openstreetmap.org/search?city=${city}&state${state}&postalcode=${zipcode}&street=${address}&format=json&accept-language=eng`;
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
    },
    mounted() {
      document
        .getElementsByClassName("form-control-file")[0]
        ?.classList.add("el-button", "el-button--default");
    }
  };
</script>

<style lang="scss">
  .wrapper {
    .importForm {
      display: flex;
      justify-content: center;
      padding: 30px 0;

      .vue-csv-uploader {
        width: 80%;
        font-size: 1.25rem;

        input,
        button {
          font-size: 1.25rem;
        }

        .vue-csv-uploader-part-one {
          text-align: center;
          align-items: center;

          div {
            margin: 1.5rem;
          }
        }

        .vue-csv-uploader-part-two {
          table {
            width: 100%;

            tr,
            th {
              padding: 0.75rem;
              vertical-align: top;
              border-top: 1px solid #dee2e6;

              td:nth-child(2) {
                width: 70%;
                padding: 0.25rem 0;

                select.form-control {
                  display: block;
                  width: 100%;
                  padding: 0.375rem 0.75rem;
                  font-size: 1rem;
                  line-height: 1.5;
                  color: #495057;
                  background-color: #fff;
                  background-clip: padding-box;
                  border: 1px solid #ced4da;
                  border-radius: 0.25rem;
                  transition: border-color 0.15s ease-in-out,
                    box-shadow 0.15s ease-in-out;
                }
              }
            }
          }
        }
      }
    }
    .instruction {
      display: block;
      max-width: 500px;
      margin: auto;
      text-align: center;
    }
  }
</style>
