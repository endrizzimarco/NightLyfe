<template lang="pug">
h4 Privacy: 
p This section is reserved for our users' privacy !
p Please, add some privacy option down here for the account security. 
br 
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