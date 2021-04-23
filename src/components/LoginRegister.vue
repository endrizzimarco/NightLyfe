<template lang="pug">
q-form.q-px-lg.q-pt-md(@submit='submitForm', ref='authForm')
  //- Name field - register only
  q-input(
    v-model='formData.name',
    v-if='tab == "register"',
    :rules='[val => (val !== null && val !== "") || "Please insert a valid name."]',
    lazy-rules,
    type='name',
    label='Name'
  )
    template(v-slot:prepend)
      q-icon(name='person')
  //- Username field - register only
  q-input(
    v-model='formData.username',
    v-if='tab == "register"',
    :rules='[val => (val !== null && val !== "") || "Please insert a valid username."]',
    lazy-rules,
    type='username',
    label='Username'
  )
    template(v-slot:prepend)
      q-icon(name='alternate_email')
  //- Email field
  q-input(
    v-model='formData.email',
    :rules='[val => (val !== null && val !== "") || "Please insert a valid email."]',
    lazy-rules,
    type='email',
    label='Email'
  )
    template(v-slot:prepend)
      q-icon(name='email')
  //- Password field
  q-input(
    type='password',
    v-model='formData.password',
    :rules='[val => (val !== null && val !== "") || "Please insert a valid password"]',
    lazy-rules,
    label='Password'
  )
    template(v-slot:prepend)
      q-icon(name='lock')
  //- Social network registration - register only
  q-card-section(v-if='tab == "register"')
    .text-center.q-py-sm.q-gutter-xl
      q-btn(round, color='indigo-7', size='lg')
        q-icon(name='fab fa-facebook-f', size='1.7rem')
      q-btn(round, color='red-8', size='lg')
        q-icon(name='fab fa-google-plus-g', size='1.7rem')
      q-btn(round, color='light-blue-5', size='lg')
        q-icon(name='fab fa-twitter', size='1.7rem')
  //- Submit button
  q-card-actions(style='padding: 1rem 0')
    q-btn.full-width.bg-brand.text-white(
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
        name: '',
        username: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.authForm.validate().then(success => {
        if (success) {
          if (this.tab == 'login') {
            this.loginUser(this.formData)
          } else if (this.tab == 'register') {
            this.registerUser(this.formData)
          }
        }
      })
    },
    ...mapActions('firebase', ['loginUser', 'registerUser'])
  }
}
</script>

<style>
</style>