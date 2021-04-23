<template lang="pug">
q-page.q-pa-lg.q-mb-xl.column.justify-end.page-chat(ref='pageChat')
  q-chat-message.text-weight-light(
    v-for='(message, key) in messages',
    :key='key',
    :name='message.from == "me" ? userDetails.username : otherUserDetails.username',
    :text='[message.text]',
    :sent='message.from == "me" ? true : false',
    :stamp='message.time',
    :bg-color='message.from == "me" ? "white" : "blue-3"',
    avatar='https://cdn.quasar.dev/img/avatar1.jpg'
  )
q-footer(elevated)
  .fixed-bottom.q-pa-xs.bg-brand.q-px-sm
    q-form.full-width.row(@submit='sendMessage')
      q-input.col-11(
        v-model='newMessage',
        ref='newMessage',
        bg-color='white',
        outlined,
        rounded,
        label='Message',
        dense
      )
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
    currentTime() {
      let d = new Date()
      let h = d.getHours()
      let m = d.getMinutes()

      return String(h) + ':' + String(m)
    },

    sendMessage() {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: 'me',
          time: this.currentTime()
        },
        otherUserId: this.$route.params.otherUserId
      })
      this.clearMessage()
    },

    clearMessage() {
      this.newMessage = ''
      this.$refs.newMessage.focus()
    },

    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight)
      }, 100)
    },

    ...mapActions('firebase', ['firebaseGetMessages', 'firebaseStopGettingMessages', 'firebaseSendMessage'])
  },

  computed: {
    ...mapState('firebase', ['messages', 'userDetails'])
  },

  watch: {
    messages: {
      deep: true,
      handler() {
        this.scrollToBottom()
      }
    }
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

<style lang='sass'>
.page-chat
  background: #d5eaf7
  &:after
    content: ''
    display: block
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 0
    opacity: 0.2
    background-image: radial-gradient(circle at 100% 150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 0 150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 50% 100%, white 10%, silver 10%, silver 23%, white 23%, white 30%, silver 30%, silver 43%, white 43%, white 50%, silver 50%, silver 63%, white 63%, white 71%, transparent 71%, transparent), radial-gradient(circle at 100% 50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent), radial-gradient(circle at 0 50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent)
    background-size: 100px 50px
.q-message
  z-index: 1
</style>