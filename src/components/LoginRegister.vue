<template lang="pug">
q-form.q-pa-lg(@submit='submitForm')
  q-input.q-mb-md(v-model='formData.email', type='email', label='Email')
    template(v-slot:prepend)
      q-icon(name='email')
  q-input.q-mb-md(v-model='formData.username', v-if='tab == "register"', type='username', label='Username')
    template(v-slot:prepend)
      q-icon(name='person')
  q-input.q-mb-md(type='password', v-model='formData.password', label='Password')
    template(v-slot:prepend)
      q-icon(name='lock')
  //- Register only
  q-card-section(v-if='tab == "register"')
    .text-center.q-pa-sm.q-gutter-xl
      q-btn(round, color='indigo-7', size='lg')
        q-icon(name='fab fa-facebook-f', size='1.7rem')
      q-btn(round, color='red-8', size='lg')
        q-icon(name='fab fa-google-plus-g', size='1.7rem')
      q-btn(round, color='light-blue-5', size='lg')
        q-icon(name='fab fa-twitter', size='1.7rem')
  q-card-actions.q-pt-lg
    q-btn.full-width(
      color='primary',
      type='submit',
      :label='tab == "login" ? "Sign In" : "Get Started"',
      size='xl',
      unelevated
    )
  //- Register only
  q-card-section.text-subtitle1.text-center.q-pt-sm(v-if='tab == "register"', style='padding-bottom: 0px')
    p.text-grey-6.q-mb-none Return to login
  //- Login only
  q-card-section.text-subtitle1.text-center.q-pt-sm(v-if='tab == "login"', style='padding-bottom: 0px')
    p.text-grey-6.q-mb-none Forgot your password?
  q-card-section.cursor-pointer.text-subtitle1.text-center.q-pa-xs(@click='$router.go(-1)', style='padding-top: 0px')
    p.text-grey-6 Go back
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['tab'],
  data() {
    return {
      formData: {
        email: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm() {
      if (this.tab == 'login') {
        this.loginUser(this.formData)
      } else {
        this.registerUser(this.formData)
      }
    },
    ...mapActions('firebase', ['loginUser', 'registerUser'])
  }
}
</script>

<style>
</style>