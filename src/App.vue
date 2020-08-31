<template>
  <div id="app">
    <CsvImporter />
  </div>
</template>

<script>
  import CsvImporter from "@/components/CsvImporter";

  export default {
    name: "App",
    components: {
      CsvImporter
    }
  };
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
