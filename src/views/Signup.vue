<template>
  <div class="section">
    <div class="container">

      <div class="card signin">
        <div class="card-content has-text-centered">
          <h1 class="title">Not Instagram</h1>
          <p class="subtitle has-text-grey my-4">
            Regístrate para ver fotos y videos de tus amigos.
          </p>
          <b-field>
            <b-input
              v-model="email" type="email" placeholder="Correo electrónico"
              :disabled="loading" autocomplete="email" required
            />
          </b-field>
          <b-field>
            <b-input
              v-model="fullName" placeholder="Nombre completo"
              :disabled="loading" autocomplete="name" required
            />
          </b-field>
          <b-field>
            <b-input
              v-model="username" placeholder="Nombre de usuario"
              :disabled="loading" autocomplete="nickname" required
            />
          </b-field>
          <b-field>
            <b-input
              v-model="password" type="password" placeholder="Contraseña"
              autocomplete="new-password" password-reveal :disabled="loading" required
            />
          </b-field>
          <b-button
            type="is-primary" expanded
            :loading="loading" @click="signUpWithEmail({email, password, fullName, username})"
          >
            Registrarte
          </b-button>
          <hr/>
          <div class="facebook" @click="signUpWithFacebook">
            <img src="../assets/facebook.svg" alt="Facebook Logo"/>
            <span>Crear cuenta con Facebook</span>
          </div>
        </div>
      </div>

      <div class="card signup">
        <div class="card-content has-text-centered">
          <p>
            ¿Tienes una cuenta?
            <router-link :to="{name: 'Login'}">Inicia Sesión</router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import userLoadMixin from '@/mixins/userLoadMixin';

export default {
  name: 'Home',
  mixins: [userLoadMixin],
  data() {
    return {
      email: null,
      fullName: null,
      username: null,
      password: null,
    };
  },
  computed: mapState(['loading']),
  methods: mapActions(['signUpWithEmail', 'signUpWithFacebook']),
};
</script>

<style scoped>
.card {
  margin: auto 30vw;
}

.card-content {
  padding: 24px 80px;
}

.signup {
  margin-top: 5vh
}

.facebook {
  display: flex;
  justify-content: center;
  align-items: center;
}

.facebook:hover {
  cursor: pointer;
}

.facebook img {
  height: 15px;
  margin-right: 5px;
}

@media screen and (max-width: 768px) {
  .card {
    margin: auto 10px;
  }

  .card-content {
    padding: 20px;
  }

  .signup {
    margin-top: 5vh
  }

}
</style>
