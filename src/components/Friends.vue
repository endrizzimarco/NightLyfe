<template lang="pug">
q-toolbar.bg-primary.text-white.shadow-2
  q-toolbar-title Contacts
q-list(bordered)
  q-item.q-my-sm(v-for='(user, key) in users', :key='key', :to='"/chat/" + key', clickable, v-ripple)
    q-item-section(avatar)
      q-avatar(color='primary', text-color='white')
        | {{ user.name.charAt(0) }}
    q-item-section
      q-item-label.text-weight-light.text-subtitle2 {{ user.name }}
      q-item-label(caption, lines='1') @{{ user.username }}
    q-item-section(side)
      q-icon(name='chat_bubble', :color='user.online ? "light-green-6" : "blue-grey-5"')
q-toolbar.absolute-bottom.bg-primary.text-white.shadow-2
  q-btn(@click='addFriends()', icon='person_add', flat, dense, label='Add Friends')
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    addFriends() {
      console.log('clicked')
    }
  },

  computed: {
    ...mapGetters('firebase', ['users'])
  }
}
</script>

<style>
</style>
