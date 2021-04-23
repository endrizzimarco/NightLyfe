<template lang='pug'>
q-layout.shadow-2.rounded-borders(view='lHh Lpr lff')
  q-page-container
    q-page.flex.justify-center(
      style='background: linear-gradient(129deg, rgba(106, 98, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)'
    )
      q-card.full-width(style='max-width: 1024px')
        q-card-section.row.bg-brand.justify-center
          h4.text-h4.text-white.q-my-lg.text-weight-light Welcome to NightLyfe
        q-tabs.text-grey(v-model='tab', active-color='primary', indicator-color='primary', align='justify')
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
    'login-register': require('components/LoginRegister').default
  }
}
</script>
<style>
</style>