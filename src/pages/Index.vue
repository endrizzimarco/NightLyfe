<template lang="pug">
q-page.flex.flex-center
  GoogleMap(
    api-key='AIzaSyBPUdoB3wV6A9L-H1-J5POiQRmgqqcL9Bk',
    style='width: 100%; height: 500px',
    :center='center',
    :zoom='15'
  )
    Marker(:options='{ position: center }')
</template>

<script>
import { defineComponent } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const center = { lat: 40.689247, lng: -74.044502 }

    return { center }
  }
})
</script>
