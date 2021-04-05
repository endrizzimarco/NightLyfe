export default {
  computed: {
    otherUserDetails() {
      if (this.$store.state.firebase.friends[this.$route.params.otherUserId]) {
        return this.$store.state.firebase.friends[this.$route.params.otherUserId]
      }
      return {}
    },
  }
}