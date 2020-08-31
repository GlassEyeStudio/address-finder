<template>
  <div id="app">
    <h1>Find Your Addresses!</h1>
    <el-steps :active="$store.state.processStep" align-center>
      <el-step title="Upload" description="Add addresses CSV file" />
      <el-step title="Processing data" description="Wait untill we finish" />
      <el-step title="Map" description="Watch your points on map" />
    </el-steps>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App",
    created() {
      this.$store.commit("setProcessStep", 1);
    }
  };
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");
  body,
  html {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: calc(100vh - 120px);
    width: calc(100%- 120px);
    padding: 60px;
    max-height: calc(100vh - 120px);
    overflow: hidden;

    .wrapper {
      width: 1270px;
      margin: 45px auto auto;
      text-align: left;
    }
  }
</style>
