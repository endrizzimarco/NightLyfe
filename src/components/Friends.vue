<template lang="pug">
q-toolbar.bg-primary.text-white.shadow-2
  q-toolbar-title Contacts
q-list(bordered)
  q-item.q-my-sm(v-for='(user, key) in friends', :key='key', :to='"/chat/" + key', clickable)
    q-item-section(avatar)
      q-avatar(color='primary', text-color='white')
        | {{ user.name.charAt(0) }}
    q-item-section
      q-item-label.text-weight-light.text-subtitle2 {{ user.name }}
      q-item-label(caption, lines='1') @{{ user.username }}
    q-item-section(side)
      q-icon(name='chat_bubble', :color='user.online ? "light-green-6" : "blue-grey-5"')
q-item.absolute-bottom.q-mb-xl(v-for='(user, key) in pending', :key='key')
  .text-weight-light.text-subtitle1 {{ user }}
    q-icon.q-pl-sm.cursor-pointer(
      @click='acceptRequest()',
      name='check_circle_outline',
      color='green',
      left,
      size='1.5rem'
    )
    q-icon.cursor-pointer(@click='denyRequest()', name='highlight_off', color='red', size='1.5rem')
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
    },
    acceptRequest() {
      console.log('accepted')
    },
    denyRequest() {
      console.log('denied')
    }
  },

  computed: {
    ...mapState('firebase', ['friends', 'pending'])
  }
}
</script>

<style>
</style>
