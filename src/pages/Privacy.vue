<template lang="pug">
h4 Privacy: 
p This section is reserved for our users' privacy !
p Please, add some privacy informations down here that might help securing more your account. 
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