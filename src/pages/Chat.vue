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
export default {
  data() {
    return {
      newMessage: '',
      messages: [
        {
          text: 'Hello',
          from: 'me'
        },
        {
          text: 'Hi',
          from: 'them'
        },
        {
          text: 'How are you?',
          from: 'me'
        }
      ]
    }
  },

  methods: {
    sendMessage() {
      this.messages.push({
        text: this.newMessage,
        from: 'me'
      })
      this.newMessage = ''
    }
  }
}
</script>

<style>
</style>