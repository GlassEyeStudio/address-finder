import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    markers: []
  },
  mutations: {
    setPointsData: (state, markers) => {
      state.markers = markers;
    }
  }
});
