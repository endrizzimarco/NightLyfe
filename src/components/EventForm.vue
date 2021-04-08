<template lang="pug">
q-card.full-width
  //- 'Create Event' Header
  q-card-section.bg-blue-grey-1(style='padding: 8px')
    span.text-subtitle1.text-weight-light.text-blue-grey-10.q-ml-sm Create your event
    q-chip.float-right(
      @click='submitEvent()',
      clickable,
      color='primary',
      text-color='white',
      icon='done',
      style='margin-top: -1px'
    ) Submit Event
  //- 'Create Event' Form
  q-card-section
    //- Event name field
    .row.q-pb-md
      q-input.full-width(
        v-model='eventData.name',
        rounded,
        outlined,
        :dense='true',
        label='Event Name',
        placeholder='Birthday Party'
      )
        template(v-slot:before)
          span.text-subtitle1.text-blue-grey-10 Name of your Event:&nbsp&nbsp
    //- Date and Time field
    span.text-subtitle1.text-blue-grey-10.q-pt-sm Date and Time:
    .row.q-pb-md.no-wrap
      q-input(
        v-model='eventData.date',
        rounded,
        outlined,
        type='date',
        :dense='true',
        hint='Date of Event',
        style='width: 60%'
      )
      q-input.q-ml-sm(
        v-model='eventData.time',
        rounded,
        outlined,
        type='time',
        :dense='true',
        hint='Time of the Event',
        style='width: 40%'
      )
    //- Location of Event field
    .row.q-pb-md
      span.text-subtitle1.text-blue-grey-10 Where?:
      q-select.full-width(
        v-model='location',
        @input-value='setUserInput',
        :options='searchResults',
        :dense='true',
        label='Search places',
        rounded,
        outlined,
        use-input,
        input-debounce='0',
        hide-selected,
        fill-input
      )
        template(v-slot:prepend)
          q-icon(name='place')
    //- Invite friends field
    .row.q-pb-md
      span.text-subtitle1.text-blue-grey-10 Invite your friends:
      q-select.full-width(
        v-model='eventData.friends',
        :dense='true',
        :options='this.options',
        label='Select friends',
        rounded,
        outlined,
        multiple,
        use-chips,
        emit-value,
        map-options
      )
        template(v-slot:prepend)
          q-icon(name='person_add')
    //- Event choose icon field
    .text-subtitle1.text-blue-grey-10 Choose an icon for your Event:
    .row.q-pb-md.justify-around
      img.cursor-pointer.q-pa-xs(
        v-for='eventType in ["Home", "Baloons", "Dancing", "Champagne", "Dj", "Gift"]',
        @click='eventData.type = eventType',
        :src='getEventIcon(eventType)',
        :style='eventData.type == eventType ? "box-shadow: 0 0 1pt 2pt #03c6fc; border-radius: 30%" : ""'
      )
    //- Event insert details field
    .row
      span.text-subtitle1.text-blue-grey-10 Details:
      q-input.full-width(
        rounded,
        outlined,
        autogrow,
        v-model='eventData.details',
        placeholder='Dress code, specifications, directions etc.',
        :dense='true'
      )
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      eventData: {
        name: '',
        date: null,
        time: null,
        friends: [],
        type: '',
        details: ''
      },
      location: '',
      userInput: 'a',
      service: null,
      searchResults: []
    }
  },

  methods: {
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.searchResults = []
        return
      }
      this.searchResults = predictions.map(prediction => prediction.description)
    },

    setUserInput(val) {
      this.userInput = val
    },

    submitEvent() {
      console.log(this.eventData)
    },

    getEventIcon(eventType) {
      switch (eventType) {
        case 'Home':
          return 'https://img.icons8.com/dusk/50/000000/home.png'
        case 'Baloons':
          return 'https://img.icons8.com/dusk/50/000000/party-baloons.png'
        case 'Dancing':
          return 'https://img.icons8.com/dusk/50/000000/dancing-party.png'
        case 'Champagne':
          return 'https://img.icons8.com/dusk/50/000000/champagne.png'
        case 'Dj':
          return 'https://img.icons8.com/dusk/50/000000/dj.png'
        case 'Gift':
          return 'https://img.icons8.com/dusk/50/000000/gift.png'
      }
    },

    placesGetPredictions() {
      this.service.getPlacePredictions(
        {
          input: this.userInput,
          location: new google.maps.LatLng(this.center),
          radius: 5000
        },
        this.displaySuggestions
      )
    },
    ...mapActions('firebase', ['firebaseSubmitEvent'])
  },

  computed: {
    options() {
      var optionsArray = []

      for (const key in this.friends) {
        let optionObject = {
          label: this.friends[key].name,
          value: key
        }
        optionsArray.push(optionObject)
      }
      return optionsArray
    },
    ...mapState('firebase', ['friends', 'center'])
  },

  watch: {
    userInput(newValue) {
      if (newValue) {
        this.placesGetPredictions()
      }
    }
  },

  mounted() {
    this.service = new window.google.maps.places.AutocompleteService()
    this.placesGetPredictions() // Default predict with letter 'a' as input
  }
}
</script>