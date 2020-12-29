import Vue from 'vue';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_FIREBASE_APP_ID,
    };
    firebase.initializeApp(firebaseConfig);
    firebase.auth()
      .onAuthStateChanged(async (user) => {
        await store.dispatch('setUser', user);
        store.commit('SET_AUTH_STATE_CHANGE');
      });

    firebase.analytics();
  },
}).$mount('#app');
