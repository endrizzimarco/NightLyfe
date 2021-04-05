<template lang="pug">
q-toolbar.bg-primary.text-white.shadow-2
  q-toolbar-title Contacts
q-list(bordered)
  q-item.q-my-sm(v-for='(user, key) in users', :key='key', :to='"/chat/" + key', clickable)
    q-item-section(avatar)
      q-avatar(color='primary', text-color='white')
        | {{ user.name.charAt(0) }}
    q-item-section
      q-item-label.text-weight-light.text-subtitle2 {{ user.name }}
      q-item-label(caption, lines='1') @{{ user.username }}
    q-item-section(side)
      q-icon(name='chat_bubble', :color='user.online ? "light-green-6" : "blue-grey-5"')
q-toolbar.absolute-bottom.bg-primary.text-white.shadow-2
  q-btn(icon='person_add', flat, dense, label='Add Friends')
  q-popup-edit.full-width(v-model='usernameInput', :cover='false', v-slot='scope', @keyup.enter='showNotif()')
    q-input(v-model='scope.value', dense, autofocus, counter, @keyup.enter='scope.set')
      template(v-slot:prepend)
        q-icon(name='person_add', color='primary')
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      usernameInput: '@'
    }
  },

  methods: {
    showNotif() {
      this.usernameInput = '@'

      this.$q.notify({
        message: 'Friend Request Sent',
        color: 'pink',
        actions: [
          {
            label: '✕',
            color: 'white'
          }
        ]
      })
    }
  },

  computed: {
    ...mapState('firebase', ['users'])
  }
}
</script>

<style>
</style>
