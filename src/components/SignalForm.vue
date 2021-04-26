<template lang="pug">
q-card.full-width
  //- Create Signal Form
  q-form(@submit='submitSignal', ref='signalForm')
    //- Create Signal Header
    q-card-section.bg-blue-grey-1(style='padding: 8px')
      span.text-subtitle1.text-weight-light.text-blue-grey-10.q-ml-sm Create new signal
      q-chip.float-right(
        @click='submitSignal()',
        clickable,
        color='accent',
        text-color='white',
        icon='done',
        style='margin-top: -1px'
      ) Create Signal
    .q-pa-md
      //- Event name field
      span.text-subtitle1.text-blue-grey-10 Type of signal:
      q-select.full-width(
        v-model='signalType',
        :options='options',
        lazy-rules,
        :rules='[val => val !== null || "Please select a signal type."]',
        label='Signal type',
        transition-show='flip-up',
        transition-hide='flip-down',
        rounded,
        outlined
      )
        template(v-slot:prepend)
          q-icon(:name='icon')
      //- Event details field
      span.text-subtitle1.text-blue-grey-10 Details:
      q-input.full-width(v-model='details', rounded, outlined, autogrow, placeholder='Describe the situation')
</template>

<script>
import { mapActions } from 'vuex'

export default {
  emits: ['submitted'],

  data() {
    return {
      signalType: null,
      options: ['Danger', 'Emergency', 'Fight Breakout', 'Free Drinks', 'Car Rental'],
      details: null
    }
  },

  methods: {
    submitSignal() {
      this.$refs.signalForm.validate().then(success => {
        if (success) {
          this.firebaseSendSignal({ type: this.signalType, details: this.details, timestamp: Date.now() })
          this.$emit('submitted')
        }
      })
    },

    ...mapActions('firebase', ['firebaseSendSignal'])
  },

  computed: {
    icon() {
      switch (this.signalType) {
        case 'Danger':
          return 'warning'
        case 'Emergency':
          return 'medical_services'
        case 'Fight Breakout':
          return 'reduce_capacity'
        case 'Free Drinks':
          return 'liquor'
        case 'Car Rental':
          return 'car_rental'
        default:
          return 'add_location'
      }
    }
  }
}
</script>