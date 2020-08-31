import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    points: []
  },
  mutations: {
    setPointsData: (state, pointsData) => {
      state.points = pointsData;
    }
  }
});
