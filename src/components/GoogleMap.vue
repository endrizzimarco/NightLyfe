<template lang="pug">
div(style='position: relative')
  div(ref='map', style='width: 100vw; height: 100vh; z-index: 0')
  q-toggle(
    @click='toggleHeatmap()',
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
    getCurrentPosition(options = {}) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },
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

    async getCrimeData() {
      const URL = `https://data.police.uk/api/crimes-street/all-crime?lat=${this.center.lat}&lng=${this.center.lng}`
      await axios
        .get(URL)
        .then(response => {
          this.crimes = response.data
        })
        .catch(error => {
          console.log(error.message)
        })
    },

    async initMap() {
      var heatmapData = []
      var infoWindow = new google.maps.InfoWindow()
      var map = new google.maps.Map(this.$refs['map'], {
        center: new google.maps.LatLng(this.center.lat, this.center.lng),
        zoom: 15,
        styles: this.mapStyles,
        disableDefaultUI: true
      })

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

      this.heatmap = heatmap
      this.map = map
    },

    toggleHeatmap() {
      this.heatmap.setMap(this.heatmap.getMap() ? null : this.map)
    },

    isPlaceOpen(place) {
      if (place.opening_hours) {
        let htmlElement = `<p class="text-negative">Closed</p>`
        if (place.opening_hours.open_now) {
          htmlElement = `<p class="text-positive ">Open</p>`
        }
        return htmlElement
      }
      return ''
    },

    getPlaceImage(place) {
      if (place.photos) {
        const URL =
          `https://secret-ocean-49799.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&key=AIzaSyBPUdoB3wV6A9L-H1-J5POiQRmgqqcL9Bk&photoreference=` +
          place.photos[0].photo_reference
        return `<img src="${URL}" height="80" width="60">`
      }
      return ''
    },

    getPlaceIcon(place) {
      let icon = 'https://img.icons8.com/color/40/000000/disco-ball.png'

      if (place.types[0] == 'bar') {
        icon = 'https://img.icons8.com/color/40/000000/beer.png'
      }
      return icon
    }
  },

  computed: {
    ...mapState(['mapStyles'])
  },

  async mounted() {
    await this.geolocate()
    await this.findPlaces()
    await this.getCrimeData()
    await this.initMap()
  }
}
</script>
