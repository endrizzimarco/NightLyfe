export default {
  computed: {
    otherUserDetails() {
      if (this.$store.state.firebase.users[this.$route.params.otherUserId]) {
        return this.$store.state.firebase.users[this.$route.params.otherUserId]
      }
      return {}
    },
  }
}