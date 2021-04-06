<template lang="pug">
p Contact number: 
q-input(rounded filled v-model="text" label="Phone number:")
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>