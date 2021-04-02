<template lang="pug">
q-banner.bg-grey-4.fixed-top(text-center='') User is Offline.
.q-pa-md.column.col.justify-end
  q-chat-message(
    v-for='message in messages',
    :key='message.text',
    :name='message.from',
    :text='[message.text]',
    :sent='message.from == "me" ? true : false'
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

export default {
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
    ...mapState('firebase', ['messages'])
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