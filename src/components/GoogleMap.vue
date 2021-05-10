<template lang="pug">
div(ref='map', style='min-height: inherit; z-index: 0')
q-toggle(
  @click='toggleHeatmap()',
  v-if='heatmap',
  v-model='toggle',
  icon='warning',
  size='5em',
  color='red',
  style='position: absolute; left: 0.5em; bottom: 2em; z-index: 1'
)
q-btn(
  @click='centerMap()',
  fab,
  color='grey-10',
  icon='my_location',
  style='position: absolute; right: 1.25em; bottom: 2.5em; z-index: 1'
) 
</template> 

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { ref } from 'vue'
import axios from 'axios'

var userMarkers = ref({})
var signalMarkers = ref({})
var eventMarkers = ref({})

export default {
  name: 'GoogleMap',

  data() {
    return {
      service: null,
      toggle: false,
      map: null,
      positionMarker: null,
      heatmap: null,
      crimes: []
    }
  },

  methods: {
    /***********************
      BUTTON CLICK HANDLERS
    ************************/
    /* Helper method to turn heatmap on/off */
    toggleHeatmap() {
      this.heatmap.setMap(this.heatmap.getMap() ? null : this.map)
    },

    /* Centers the map on user position when the button is pressed */
    centerMap() {
      this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng))
      this.map.setZoom(15)
    },

    /*********************
        GEOLOCATE API
    **********************/
    /* Fetch current position using MDN Geolocation API */
    getCurrentPosition(options = {}) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },

    /* Save current estimated position to the store and firebase's db */
    async geolocate() {
      if (navigator.geolocation) {
        try {
          const position = await this.getCurrentPosition()
          let center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.firebaseSavePosition(center)
        } catch (error) {
          console.error(error)
        }
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },

    /*********************
          PLACES API
    **********************/
    /* Finds 20 places related to keyword 'nightlife' in 1500m proximity of center coordinates */
    initPlaces() {
      var request = {
        location: new google.maps.LatLng(this.center.lat, this.center.lng),
        radius: 1500,
        keyword: 'nightlife'
      }
      this.service.nearbySearch(request, this.mapsAddPlacesMarkers)
    },

    /* Return hmtl img element of the first picture listed on maps for an establishment */
    getPlaceImage(placeImage) {
      if (!placeImage) {
        return ''
      }
      return `<img width="80" height="120" src="${placeImage[0].getUrl({ maxWidth: 80, maxHeight: 120 })}">`
    },

    /* Return specific icon based on first element of 'types' attribute for an establishment */
    getPlaceIcon(place) {
      let icon = 'https://img.icons8.com/color/40/000000/disco-ball.png'

      if (place.types[0] == 'bar') {
        icon = 'https://img.icons8.com/color/40/000000/beer.png'
      } else if (place.types[0] == 'restaurant') {
        icon = 'https://img.icons8.com/color/40/000000/food-and-wine.png'
      }
      return icon
    },

    /*********************
          CRIMES API 
    **********************/
    /* Return an array containing the dates of last 3 months since the uk.police API was updated */
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

    /* Load crime data of past 3 months into the 'crimes' variable */
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

    /*********************
        GOOGLE MAPS API
    **********************/
    /* Initialize stylized map, nightlife places markers and crime heatmap */
    async initMap() {
      var heatmapData = []
      // Initialize the map instance, load the styles from the vuex store
      var map = new google.maps.Map(this.$refs['map'], {
        center: new google.maps.LatLng(this.center.lat, this.center.lng),
        zoom: 15,
        styles: this.mapStyles,
        disableDefaultUI: true
      })

      this.service = new google.maps.places.PlacesService(map)

      // Initializes your position on the map
      this.positionMarker = new google.maps.Marker({
        position: new google.maps.LatLng(this.center.lat, this.center.lng),
        map: map
      })

      // Save map instance for global access in other methods
      this.map = map

      // Wait for google Places API to be finished fetching relevant data
      this.initPlaces()

      // Wait for police.uk API to return crime data
      await this.getCrimeData()
      // Create a heatmap based on crimes location
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

      // Save heatmap reference for user in toggleHeatmap()
      this.heatmap = heatmap

      // Slow down!!!
      if (!this.signals) {
        await this.sleep(200)
      }

      // Add all signals saved in the store on the map
      for (const signalId in this.signals) {
        this.mapsAddSignal(signalId)
      }

      // Add all event saved in the store on the map
      for (const eventId in this.events) {
        this.mapsAddEvent(eventId)
      }

      // Add all users saved in the store on the map
      for (const userId in this.users) {
        this.mapsAddUserMarker(userId)
      }

      // Reinitialize user on the map
      this.geolocate()
    },

    /* Creates markers and infoWindows for every relevant nightlife establishment in the area */
    mapsAddPlacesMarkers(results, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return
      }

      var infoWindow = new google.maps.InfoWindow()

      results.forEach(place => {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: this.map,
          icon: this.getPlaceIcon(place)
        })

        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.setContent(
            `<div class="row nowrap"><div class="col"> ${this.getPlaceImage(place.photos)} </div>
            <div class="col-7"> <p class="text-subtitle2">${place.name}</p>
            <p class="text-weight-light">${place.vicinity}</p> <p>${place.rating} ⭐</p></div></div>`
          )
          infoWindow.open(this.map, marker)
        })
      })
    },

    /* Code snippet to add a marker and info window on the map for a signal */
    mapsAddSignal(signalId) {
      var signal = this.signals[signalId]
      var infoWindow = new google.maps.InfoWindow()

      signalMarkers[signalId] = new google.maps.Marker({
        position: new google.maps.LatLng(signal.lat, signal.lng),
        map: this.map,
        icon: this.getSignalIcon(signal.type)
      })

      google.maps.event.addListener(signalMarkers[signalId], 'click', () => {
        infoWindow.setContent(
          `<p class="text-subtitle1" style="margin-bottom:8px;">${signal.type}</p>
            <p class="text-weight-light">${signal.details}</p>`
        )
        infoWindow.open(this.map, signalMarkers[signalId])
      })
    },

    /* Removes the signal marker from the map */
    mapsRemoveSignal(signalId) {
      signalMarkers[signalId].setMap(null)
      delete signalMarkers[signalId]
    },

    /* Returns the image source for every type of signal */
    getSignalIcon(signalType) {
      switch (signalType) {
        case 'Danger':
          return 'https://img.icons8.com/color/50/000000/error--v1.png'
        case 'Emergency':
          return 'https://img.icons8.com/color/50/000000/ambulance.png'
        case 'Fight Breakout':
          return 'https://img.icons8.com/color/50/000000/judo.png'
        case 'Free Drinks':
          return 'https://img.icons8.com/color/50/000000/dizzy-person.png'
        case 'Car Rental':
          return 'https://img.icons8.com/color/50/000000/car-rental.png'
      }
    },

    /* Code snippet to add a marker and info window on the map for an event */
    mapsAddEvent(eventId) {
      var event = this.events[eventId]
      var infoWindow = new google.maps.InfoWindow()

      eventMarkers[eventId] = new google.maps.Marker({
        position: new google.maps.LatLng(event.lat, event.lng),
        map: this.map,
        icon: this.getEventIcon(event.type)
      })

      google.maps.event.addListener(eventMarkers[eventId], 'click', () => {
        infoWindow.setContent(
          `<p class="text-subtitle1" style="margin-bottom:8px;">${event.name} (${event.date} ${event.time}) </p>
            <p class="text-weight-light">${event.details}</p>`
        )
        infoWindow.open(this.map, eventMarkers[eventId])
      })
    },

    /* Removes the event marker from the map */
    mapsRemoveEvent(eventId) {
      eventMarkers[eventId].setMap(null)
      delete eventMarkers[eventId]
    },

    /* Returns the image source for every type of event */
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

    mapsAddUserMarker(userId) {
      var userPosition = this.users[userId].position

      userMarkers[userId] = new google.maps.Marker({
        position: new google.maps.LatLng(userPosition.lat, userPosition.lng),
        map: this.map,
        icon: 'https://img.icons8.com/nolan/64/men-age-group-4--v2.png'
      })
    },

    mapsRemoveUserMarker(userId) {
      userMarkers[userId].setMap(null)
      delete userMarkers[userId]
    },

    mapsMoveUserMarker(userId) {
      let newPosition = this.users[userId].position
      userMarkers[userId].setPosition(newPosition)
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    ...mapActions('firebase', ['firebaseSavePosition'])
  },

  computed: {
    ...mapState(['mapStyles']),
    ...mapState('firebase', ['users', 'signals', 'events']),
    ...mapGetters('firebase', ['center', 'latestUserChange', 'latestSignalChange', 'latestEventChange'])
  },

  watch: {
    center(newValue) {
      if (this.map) {
        this.positionMarker.setPosition(newValue)
      }
    },

    latestUserChange: {
      deep: true,
      // Watch for user related changes
      handler() {
        let userId = this.latestUserChange.userId
        if (this.latestUserChange.type == 'add') {
          this.mapsAddUserMarker(userId)
        } else if (this.latestUserChange.type == 'remove') {
          this.mapsRemoveUserMarker(userId)
        } else if (this.latestUserChange.type == 'move') {
          this.mapsMoveUserMarker(userId)
        }
      }
    },

    latestSignalChange: {
      deep: true,
      // Watch for signal related changes
      handler() {
        let signalId = this.latestSignalChange.signalId
        if (this.latestSignalChange.type == 'add') {
          this.mapsAddSignal(signalId)
        } else if (this.latestSignalChange.type == 'remove') {
          this.mapsRemoveSignal(signalId)
        }
      }
    },

    latestEventChange: {
      deep: true,
      // Watch for events related changes
      handler() {
        let eventId = this.latestEventChange.eventId
        if (this.latestEventChange.type == 'add') {
          this.mapsAddEvent(eventId)
        } else if (this.latestEventChange.type == 'remove') {
          this.mapsRemoveEvent(eventId)
        }
      }
    }
  },

  async created() {
    // Wait for current location to be fetched and saved to store
    await this.geolocate()
    // Wait for map and map components to be loaded
    await this.initMap()
    // Geolocate user every 10 seconds if on Index page
    this.interval = window.setInterval(() => {
      this.geolocate()
    }, 10000)
  },

  unmounted() {
    // Stop geolocating user if not on Index page
    window.clearInterval(this.interval)
  }
}
</script>
