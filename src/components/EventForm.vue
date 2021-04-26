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
  q-form.q-pa-md(ref='eventForm')
    //- Event name field
    .row.q-pb-md
      q-input.full-width(
        v-model='eventData.name',
        :dense='true',
        :rules='[val => (val !== null && val !== "") || "Please insert a name for the event."]',
        lazy-rules,
        rounded,
        outlined,
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
        :dense='true',
        :rules='[val => val !== null || "Please insert a valid date for the event."]',
        lazy-rules,
        rounded,
        outlined,
        type='date',
        hint='Date of Event',
        style='width: 60%'
      )
      q-input.q-ml-sm(
        v-model='eventData.time',
        :dense='true',
        :rules='[val => val !== null || "Please insert a valid time for the event."]',
        lazy-rules,
        rounded,
        outlined,
        type='time',
        hint='Time of the Event',
        style='width: 40%'
      )
    //- Location of Event field
    .row.q-pb-md
      span.text-subtitle1.text-blue-grey-10 Where?:
      q-select.full-width(
        v-model='location',
        @input-value='setUserInput',
        :options='placesOptions',
        :dense='true',
        :rules='[val => (val !== null && val !== "") || "Please select a location for the event."]',
        lazy-rules,
        label='Search places',
        rounded,
        outlined,
        use-input,
        input-debounce='0',
        emit-value,
        map-options
      )
        template(v-slot:prepend)
          q-icon(name='place')
        template(v-slot:no-option)
          q-item
            q-item-section.text-grey No results
    //- Invite friends field
    .row.q-pb-md
      span.text-subtitle1.text-blue-grey-10 Invite your friends:
      q-select.full-width(
        v-model='eventData.friends',
        :dense='true',
        :options='friendsOptions',
        lazy-rules,
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
        :style='eventData.type == eventType ? "box-shadow: 0 0 1pt 2pt #0080ff; border-radius: 30%" : ""'
      )
    //- Event details field
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
import axios from 'axios'

export default {
  emits: ['submitted'],

  data() {
    return {
      eventData: {
        name: '',
        date: null,
        time: null,
        friends: [],
        type: 'Home',
        details: ''
      },
      location: '',
      userInput: 'a',
      service: null,
      searchResults: []
    }
  },

  methods: {
    submitEvent() {
      this.$refs.eventForm.validate().then(async success => {
        if (success) {
          // Turn place name into coordinates to save in db
          await this.geocodeLocation()
          this.eventData['friends'] = this.friendsObject // turn array into object
          this.eventData['timestamp'] = Date.now() // add timestamp
          // Save eventData object under events node in db
          this.firebaseSubmitEvent(this.eventData)
          this.$emit('submitted')
        }
      })
    },

    placesGetPredictions() {
      this.service.getPlacePredictions(
        {
          input: this.userInput,
          location: new google.maps.LatLng(this.center),
          radius: 5000
        },
        this.savePredictions
      )
    },

    savePredictions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.searchResults = []
        return
      }
      this.searchResults = predictions
    },

    async geocodeLocation() {
      const URL = `https://secret-ocean-49799.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.location}&fields=geometry&key=AIzaSyBPUdoB3wV6A9L-H1-J5POiQRmgqqcL9Bk`

      await axios
        .get(URL)
        .then(response => {
          let placeLocation = response.data.result.geometry.location

          this.eventData['lat'] = placeLocation.lat
          this.eventData['lng'] = placeLocation.lng
        })
        .catch(error => {
          console.log(error)
        })
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

    setUserInput(val) {
      this.userInput = val
    },

    ...mapActions('firebase', ['firebaseSubmitEvent'])
  },

  computed: {
    friendsOptions() {
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

    placesOptions() {
      var optionsArray = []

      for (const key in this.searchResults) {
        let result = this.searchResults[key]

        let optionObject = {
          label: result.description,
          value: result.place_id
        }
        optionsArray.push(optionObject)
      }
      return optionsArray
    },

    friendsObject() {
      let friendsObj = {}

      this.eventData.friends.forEach(friendKey => {
        friendsObj[friendKey] = true
      })

      return friendsObj
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