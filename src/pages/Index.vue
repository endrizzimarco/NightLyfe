<template lang="pug">
q-page
  GoogleMap
</template> 

<script>
import { defineComponent } from 'vue'
import GoogleMap from 'components/GoogleMap.vue'

export default defineComponent({
  components: { GoogleMap }
})
</script>
