<template lang="pug">
q-toolbar.bg-primary.text-white.shadow-2
  q-toolbar-title Contacts
q-list(bordered)
  q-item.q-my-sm(v-for='user in users', :key='user.id', to='/chat', clickable, v-ripple)
    q-item-section(avatar)
      q-avatar(color='primary', text-color='white')
        | {{ user.name.charAt(0) }}
    q-item-section
      q-item-label.text-weight-light.text-subtitle2 {{ user.name }}
    q-item-section(side)
      q-icon(name='chat_bubble', :color='user.online ? "light-green-6" : "blue-grey-5"')
q-toolbar.absolute-bottom.bg-primary.text-white.shadow-2
  q-btn(@click='addFriends()', icon='person_add', flat, dense, label='Add Friends')
</template>

<script>
export default {
  data() {
    return {
      users: [
        {
          id: 1,
          name: 'Marco Endrizzi',
          online: true
        },
        {
          id: 2,
          name: 'Ahmed Henine',
          online: true
        },
        {
          id: 3,
          name: 'Maya Meylan',
          online: false
        },
        {
          id: 4,
          name: 'Gunes Kaan',
          online: false
        }
      ]
    }
  },
  methods: {
    addFriends() {
      console.log('clicked')
    }
  }
}
</script>

<style>
</style>
