<template lang="pug">
div(style='position: relative')
  div(ref='map', style='width: 100vw; height: 100vh; z-index: 0')
  q-toggle(
    @click='toggleHeatmap()',
    v-if='heatmap',
    v-model='toggle',
    icon='warning',
    size='5em',
    color='red',
    style='position: absolute; left: 5px; top: 5px; z-index: 1'
  )
</template> 

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'GoogleMap',

  data() {
    return {
      toggle: false,
      center: null,
      map: null,
      heatmap: null,
      places: [],
      crimes: []
    }
  },

  methods: {
    // Helper method to turn heatmap on/off
    toggleHeatmap() {
      this.heatmap.setMap(this.heatmap.getMap() ? null : this.map)
    },

    /*********************
      APIs IMPLEMENTATION
    **********************/
    // Fetch current position using MDN Geolocation API
    getCurrentPosition(options = {}) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },
    // Set center variable to current estimated coordinates
    async geolocate() {
      if (navigator.geolocation) {
        try {
          const position = await this.getCurrentPosition()
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    // Set center variable to current estimated coordinates
    async findPlaces() {
      const URL = `https://secret-ocean-49799.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.center.lat},${this.center.lng}
                    &radius=1500
                    &keyword=nightlife
                    &key=AIzaSyBPUdoB3wV6A9L-H1-J5POiQRmgqqcL9Bk`
      await axios
        .get(URL)
        .then(response => {
          this.places = response.data.results
        })
        .catch(error => {
          console.log(error.message)
        })
    },
    // Return an array containing the dates of last 3 months since the uk.police API was updated
    async fetchDates() {
      var datesArray = []
      const lastUpdateURL = `https://data.police.uk/api/crime-last-updated`
      await axios
        .get(lastUpdateURL)
        .then(response => {
          let lastUpdate = response.data.date.split('-')
          let month = lastUpdate[1]
          let year = lastUpdate[0]

          for (let i = 0; i < 3; i++) {
            datesArray.push(year + '-' + month)
            if (month <= 1) {
              month = 12
              year -= 1
            } else {
              month -= 1
            }
          }
        })
        .catch(error => {
          console.log(error.message)
        })
      return datesArray
    },
    // Load crime data of past 3 months into crimes variable
    async getCrimeData() {
      let dates = await this.fetchDates()

      for (const date of dates) {
        const URL = `https://data.police.uk/api/crimes-street/all-crime?lat=${this.center.lat}&lng=${this.center.lng}&date=${date}`
        await axios
          .get(URL)
          .then(response => {
            let crimeData = response.data
            this.crimes = this.crimes.concat(crimeData)
          })
          .catch(error => {
            console.log(error.message)
          })
      }
    },
    // Initialize stylized map, nightlife places markers and crime heatmap
    async initMap() {
      var heatmapData = []
      var infoWindow = new google.maps.InfoWindow()
      // Initialize the map instance, load the styles from the vuex store
      var map = new google.maps.Map(this.$refs['map'], {
        center: new google.maps.LatLng(this.center.lat, this.center.lng),
        zoom: 15,
        styles: this.mapStyles,
        disableDefaultUI: true
      })

      // Add marker for every nightlife establishment along with an info window
      await this.findPlaces()
      this.places.forEach(place => {
        const lat = place.geometry.location.lat
        const lng = place.geometry.location.lng

        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          icon: this.getPlaceIcon(place)
        })

        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.setContent(
            `<div class="row nowrap"><div class="col"> ${this.getPlaceImage(place)} ${this.isPlaceOpen(place)}</div>
            <div class="col-7"> <p class="text-subtitle2">${place.name}</p>
            <p class="text-weight-light">${place.vicinity}</p> <p>${place.rating} ⭐</p></div></div>`
          )
          infoWindow.open(map, marker)
        })
      })

      // Create a heatmap based on crimes location
      await this.getCrimeData()
      this.crimes.forEach(crime => {
        const lat = crime.location.latitude
        const lng = crime.location.longitude

        heatmapData.push(new google.maps.LatLng(lat, lng))
      })

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      })
      heatmap.set('radius', heatmap.get('radius') ? null : 80)
      heatmap.set('opacity', heatmap.get('opacity') ? null : 0.3)

      // Save heatmap and map instance for use in toggleHeatmap()
      this.heatmap = heatmap
      this.map = map
    },

    /*********************
      GET PLACE'S DETAILS
    **********************/
    // Return html element, either Open or closed
    isPlaceOpen(place) {
      if (place.opening_hours) {
        let htmlElement = `<p class="text-negative">Closed</p>`
        if (place.opening_hours.open_now) {
          htmlElement = `<p class="text-positive">Open</p>`
        }
        return htmlElement
      }
      return ''
    },
    // Return hmtl img element of first picture listed for establishment, if any
    getPlaceImage(place) {
      if (place.photos) {
        const URL =
          `https://secret-ocean-49799.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&key=AIzaSyBPUdoB3wV6A9L-H1-J5POiQRmgqqcL9Bk&photoreference=` +
          place.photos[0].photo_reference
        return `<img src="${URL}" height="80" width="60">`
      }
      return ''
    },
    // Return specific icon based on first element of 'types' attribute for an establishment
    getPlaceIcon(place) {
      let icon = 'https://img.icons8.com/color/40/000000/disco-ball.png'

      if (place.types[0] == 'bar') {
        icon = 'https://img.icons8.com/color/40/000000/beer.png'
      } else if (place.types[0] == 'restaurant') {
        icon = 'https://img.icons8.com/color/40/000000/food-and-wine.png'
      }
      return icon
    }
  },

  computed: {
    ...mapState(['mapStyles'])
  },

  async mounted() {
    await this.geolocate()
    await this.initMap()
  }
}
</script>
