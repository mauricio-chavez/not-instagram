<template>
  <div class="section">
    <div class="container">
      <div class="card mx-5">
        <div class="card-content has-text-centered">
          <h1 class="title">Not Instagram</h1>
          <figure class="image is-64x64">
            <img class="is-rounded" :src="user.photoURL" :alt="'@' + user.username">
          </figure>

          <h2 class="subtitle mt-3 mb-0"><strong>{{ user.fullName }}</strong></h2>
          <h2 class="subtitle">@{{ user.username }}</h2>
          <b-button @click="logout">Cerrar sesión</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Feed',
  computed: mapState({
    user: (state) => state.auth.user,
  }),
  methods: mapActions(['logout']),
};
</script>

<style scoped>
figure {
  margin: auto;
}
</style>
