<template lang="pug">
q-page.flex.flex-center
  GoogleMap
</template> 

<script>
import { defineComponent } from 'vue'
import GoogleMap from 'components/GoogleMap.vue'

export default defineComponent({
  components: { GoogleMap }
})
</script>
