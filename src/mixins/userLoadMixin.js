import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      isFullLoading: !!localStorage.getItem('shouldCheckAuth'), // This is how we know that we should check for a session next time
    };
  },
  computed: {
    ...mapState({
      authStageChanged: (state) => state.auth.authStageChanged,
    }),
    ...mapGetters(['isAuthenticated']),
  },
  watch: {
    async authStageChanged() {
      this.isFullLoading = false;
      if (this.isAuthenticated) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (redirect) {
          await this.$router.push(redirect);
        } else {
          await this.$router.push({ name: 'Feed' });
        }
      }
    },
  },
};
