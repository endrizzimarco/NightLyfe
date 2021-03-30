<template lang="pug">
q-form(@submit='submitForm')
  q-input.q-mb-md(v-if='tab == "register"', outlined='', type='name', v-model='formData.name', label='Name')
  q-input.q-mb-md(outlined='', type='email', v-model='formData.email', label='Email')
  q-input.q-mb-md(outlined='', type='password', v-model='formData.password', label='Password')
  .row
    q-space
    q-btn(color='primary', type='submit', :label='tab')
</template>

<script>
export default {
  props: ['tab'],
  data() {
    return {
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm() {
      if (this.tab == 'login') {
        console.log('login the user')
      } else {
        console.log('register the user')
      }
    }
  }
}
</script>

<style>
</style>