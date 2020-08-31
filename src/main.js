import Vue from "vue";
import App from "./App.vue";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import VueAxios from "vue-axios";
import axios from "axios";
import router from "./router";
import Vuex from "vuex";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.use(ElementUI);

Vue.use(VueAxios, axios);

Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
