<template>
  <div class="wrapper">
    <vue-csv-import
      v-model="parseCsv"
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
    >
      <template slot="hasHeaders" slot-scope="{headers, toggle}">
        <label>
          <input type="checkbox" id="hasHeaders" :value="headers" @change="toggle">
          Headers?
        </label>
      </template>

      <template slot="thead">
        <tr>
          <th>My Fields</th>
          <th>Column</th>
        </tr>
      </template>

      <template slot="next" slot-scope="{load}">
        <button @click.prevent="load">load!</button>
      </template>

      <template slot="submit" slot-scope="{submit}">
        <button @click.prevent="submit">send!</button>
      </template>
    </vue-csv-import>
  </div>
</template>

<script>
  import { VueCsvImport } from "vue-csv-import";

  export default {
    name: "CsvImporter",
    components: { VueCsvImport },
    data() {
      return {
        parseCsv: []
      };
    }
  };
</script>

<style scoped></style>
