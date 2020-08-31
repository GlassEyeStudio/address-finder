<template>
  <div id="app">
    <h1>Find Your Addresses!</h1>
    <el-button
      class="floating"
      type="success"
      v-if="$store.state.processStep === 3"
    >
      New query
    </el-button>
    <el-steps :active="$store.state.processStep" simple>
      <el-step title="Upload your CSV" icon="el-icon-upload" />
      <el-step title="Let us do the magic" icon="el-icon-magic-stick" />
      <el-step title="See results on the map" icon="el-icon-map-location" />
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
    .floating {
      position: fixed;
      top: 50px;
      left: 50px;
    }
  }
</style>
