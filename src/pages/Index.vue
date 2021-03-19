<template lang="pug">
q-page.flex.flex-center
  GoogleMap(:api-key='api_key', style='width: 100%; height: 500px', :center='center', :zoom='15')
    Marker(:options='{ position: center }')
</template> 

<script>
import { defineComponent } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

export default defineComponent({
  components: { GoogleMap, Marker },

  data() {
    return {
      center: null,
      api_key: process.env.API_KEY
    }
  },

  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    }
  },

  mounted() {
    this.geolocate()
  }
})
</script>
