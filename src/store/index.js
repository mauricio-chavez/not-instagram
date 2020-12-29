import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line import/no-cycle
import auth from './modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false, // Only a part of the app is loading
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
  },
  modules: { auth },
});
