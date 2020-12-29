<template>
  <div class="section">
    <b-loading v-model="isFullLoading"></b-loading>
    <div class="container">
      <div class="card signup">
        <div class="card-content has-text-centered">
          <h1 class="title">Not Instagram</h1>

          <div class="email-signup" v-show="showEmailSignup">
            <b-field>
              <b-input
                v-model="email" type="email" placeholder="Correo electrónico"
                :disabled="loading" autocomplete="email" required
              />
            </b-field>
            <b-field>
              <b-input
                v-model="password" type="password" placeholder="Contraseña"
                :disabled="loading" password-reveal required
              />
            </b-field>
            <b-button type="is-primary" :loading="loading" expanded
                      @click="loginWithEmail({email, password})"
            >
              Iniciar sesión
            </b-button>
          </div>

          <div class="facebook-signup" v-show="showFacebookSignup">
            <hr/>
            <div class="facebook" @click="loginWithFacebook">
              <img src="../assets/facebook.svg" alt="Facebook Logo"/>
              <span>Iniciar sesión con Facebook</span>
            </div>
          </div>

        </div>
      </div>
      <div class="card signin">
        <div class="card-content has-text-centered">
          <p>
            ¿No tienes una cuenta?
            <router-link :to="{name: 'Signup'}">Regístrate</router-link>
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
  name: 'Login',
  mixins: [userLoadMixin],
  props: {
    message: String,
  },
  data() {
    return {
      email: null,
      password: null,
      showEmailSignup: true,
      showFacebookSignup: true,
    };
  },
  computed: {
    ...mapState(['loading']),
  },
  methods: mapActions(['loginWithEmail', 'loginWithFacebook']),
  created() {
    if (this.message) {
      this.$buefy.toast.open({
        message: this.message,
        duration: 6000,
        type: 'is-success',
      });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const register = urlParams.get('register');
    if (register === 'facebook') {
      this.showEmailSignup = false;
    }

    if (register === 'email') {
      this.showFacebookSignup = false;
    }
  },
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
  margin-top: 10vh
}

.signin {
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
    margin-top: 10vh
  }

  .signin {
    margin-top: 5vh
  }

}
</style>
