import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    processStep: 0,
    markers: []
  },
  mutations: {
    setProcessStep: (state, processStep) => {
      state.processStep = processStep;
    },
    setPointsData: (state, markers) => {
      state.markers = markers;
    }
  }
});
