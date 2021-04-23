<template lang='pug'>
q-layout.shadow-2.rounded-borders(view='lHh Lpr lff')
  q-page-container
    q-page.flex.justify-center(
      style='background: linear-gradient(129deg, rgba(106, 98, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)'
    )
      q-card.full-width(style='max-width: 1024px')
        q-card-section.row.bg-brand.justify-center
          h4.text-h4.text-white.q-my-lg.text-weight-light Contact Us
        q-card-section.q-pa-xl
          q-form(@submit='submitForm', ref='contactUsForm')
            //- Name field 
            q-input(
              v-model='name',
              :rules='[val => (val !== null && val !== "") || "Please insert a valid name."]',
              lazy-rules,
              type='name',
              label='Name'
            )
              template(v-slot:prepend)
                q-icon(name='person')
            //- Email field
            q-input(
              v-model='email',
              :rules='[val => (val !== null && val !== "") || "Please insert a valid email."]',
              lazy-rules,
              type='email',
              label='Email'
            )
              template(v-slot:prepend)
                q-icon(name='alternate_email')
            //- Telephone field
            q-input.q-pb-xl(v-model='phone', type='phone', label='Phone')
              template(v-slot:prepend)
                q-icon(name='phone')
            q-input.q-pb-xl(
              v-model='message',
              :rules='[val => val !== null || "Please insert a message"]',
              outlined,
              autogrow,
              type='message',
              label='Message'
            )
          q-btn.full-width.bg-brand.text-white(type='submit', label='Submit', size='xl', unelevated)
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      phone: null,
      message: ''
    }
  },

  methods: {
    submitForm() {
      this.$refs.contactUs.validate().then(success => {
        if (success) {
          this.$q.notify({
            message: 'Message sent.',
            color: 'pink',
            actions: [
              {
                label: '✕',
                color: 'white'
              }
            ]
          })
        }
      })
    }
  }
}
</script>

<style>
</style>