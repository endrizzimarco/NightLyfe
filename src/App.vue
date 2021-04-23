<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'App',

  methods: {
    ...mapActions('firebase', ['handleAuthStateChanged'])
  },

  created() {
    this.handleAuthStateChanged()
  }
})
</script>

<style>
.bg-brand {
  background: #1b65af;
}
</style>
