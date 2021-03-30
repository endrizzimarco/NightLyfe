<template lang="pug">
q-page.flex.q-pa-nd
  q-list.full-width(seperator='')
    q-item(v-for='user in users', :key='user.id', to='/chat', clickable, v-ripple)
      q-item-section(avatar='')
        q-avatar(color='primary', text-color='white')
          | {{ user.name.charAt(0) }}
      q-item-section
        q-item-label {{ user.name }}
      q-item-section(side='')
        q-badge(:color='user.online ? "light-green-5" : "gray-4"')
          | {{  user.online ? &apos;Online&apos; : &apos;Offline&apos;  }}
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
  }
}
</script>

<style>
</style>
