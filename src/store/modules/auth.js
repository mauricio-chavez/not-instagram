import firebase from '@/services/firebase';
import { ToastProgrammatic as Toast } from 'buefy';

// eslint-disable-next-line import/no-cycle
import router from '@/router';

const localState = {
  user: null,
  authStageChanged: false,
};

const getters = {
  isAuthenticated: (state) => !!state.user,
};

const actions = {
  async setUser({ commit }, user) {
    let settedUser = user;
    if (user) {
      settedUser = await firebase.fillUserAttributes(user);
    }
    commit('SET_USER', settedUser);
  },
  async getCurrentUser({ commit }) {
    const user = await firebase.getCurrentUser();
    commit('SET_USER', user);
  },
  async loginWithEmail({ commit, dispatch }, { email, password }) {
    commit('SET_LOADING', true);
    const [isAuthenticated, messageOrUser] = await firebase.loginWithEmail(email, password);
    if (isAuthenticated) {
      dispatch('setUser', messageOrUser);
      await router.push({ name: 'Feed' });
    } else {
      Toast.open({
        duration: 5000,
        message: messageOrUser.toString(),
        type: 'is-danger',
      });
    }
    commit('SET_LOADING', false);
  },
  async loginWithFacebook({ commit, dispatch }) {
    commit('SET_LOADING', true);
    const [isAuthenticated, messageOrUser] = await firebase.loginWithFacebook();
    if (isAuthenticated) {
      dispatch('setUser', messageOrUser);
      await router.push({ name: 'Feed' });
    } else {
      Toast.open({
        duration: 5000,
        message: messageOrUser.toString(),
        type: 'is-danger',
      });
    }
    commit('SET_LOADING', false);
  },
  async signUpWithEmail({ commit }, payload) {
    commit('SET_LOADING', true);
    const {
      email, password, fullName, username,
    } = payload;
    const [success, messageOrUser] = await firebase
      .signUpWithEmail(email, password, fullName, username);
    if (success) {
      await router.push({
        name: 'Login',
        params: {
          message: 'Te hemos enviado un correo de confirmación necesario para continuar',
        },
        query: { register: 'email' },
      });
    } else {
      Toast.open({
        duration: 5000,
        message: messageOrUser.toString(),
        type: 'is-danger',
      });
    }
    commit('SET_LOADING', false);
  },
  async signUpWithFacebook({ commit }) {
    commit('SET_LOADING', true);
    const [success, messageOrUser] = await firebase.signUpWithFacebook();
    if (success) {
      await router.push({
        name: 'Login',
        params: {
          message: 'Te hemos enviado un correo de confirmación necesario para continuar',
        },
        query: { register: 'facebook' },
      });
    } else {
      Toast.open({
        duration: 5000,
        message: messageOrUser.toString(),
        type: 'is-danger',
      });
    }
    commit('SET_LOADING', false);
  },
  logout() {
    localStorage.removeItem('shouldCheckAuth');
    router.push({ name: 'Login' });
    firebase.logout();
  },
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    if (user) {
      localStorage.setItem('shouldCheckAuth', 'yup');
    }
  },
  SET_AUTH_STATE_CHANGE(state) {
    state.authStageChanged = true;
  },
};

export default {
  getters,
  actions,
  mutations,
  state: localState, // This is due to shadowing warnings
};
