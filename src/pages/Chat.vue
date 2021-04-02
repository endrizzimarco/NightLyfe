<template lang="pug">
q-page.q-pa-lg.column.justify-end
  q-chat-message.text-weight-light(
    v-for='message in messages',
    :key='message.text',
    :name='message.from == "me" ? userDetails.username : otherUserDetails.username',
    :text='[message.text]',
    :sent='message.from == "me" ? true : false',
    avatar='https://cdn.quasar.dev/img/avatar1.jpg'
  )
q-footer(elevated)
  q-toolbar
    q-form.full-width(@submit='sendMessage')
      .row
        q-input.col-11(v-model='newMessage', bg-color='white', outlined, rounded, label='Message', dense)
        q-btn.col-1(type='submit', icon='send', color='white', round, dense, flat)
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

export default {
  mixins: [mixinOtherUserDetails],

  data() {
    return {
      newMessage: ''
    }
  },

  methods: {
    sendMessage() {
      this.messages.push({
        text: this.newMessage,
        from: 'me'
      })
      this.newMessage = ''
    },
    ...mapActions('firebase', ['firebaseGetMessages', 'firebaseStopGettingMessages'])
  },

  computed: {
    ...mapState('firebase', ['messages', 'userDetails'])
  },

  mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId)
  },

  // Fire when the user leaves the page
  unmounted() {
    this.firebaseStopGettingMessages()
  }
}
</script>

<style>
</style>