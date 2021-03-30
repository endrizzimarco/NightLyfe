<template lang='pug'>
q-layout.shadow-2.rounded-borders(view='lHh Lpr lff')
  q-page-container
    q-page.flex.q-pa-md
      q-card.full-width
        q-tabs.text-grey(
          v-model='tab',
          dense,
          active-color='primary',
          indicator-color='primary',
          align='justify',
          narrow-indicator
        )
          q-tab(name='login', label='Login')
          q-tab(name='register', label='Register')
        q-separator
        q-tab-panels(v-model='tab', animated)
          q-tab-panel(name='login')
            login-register(:tab='tab')
          q-tab-panel(name='register')
            login-register(:tab='tab')
</template>

<script>
export default {
  data() {
    return {
      tab: 'login'
    }
  },
  components: {
    'login-register': require('components/Login').default
  }
}
</script>
<style>
</style>