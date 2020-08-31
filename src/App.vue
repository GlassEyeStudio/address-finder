<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App"
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

    .wrapper {
      height: 80vh;
      width: 100%;
    }
  }
</style>
