<template lang="pug">
h4(class='title') <mark>Privacy Policy:</mark>
div(class='text')
  p If you have any problems our queries with our app then feel free to contact us using the form below!
  form
<br>
</template>

<script>
export default {
  data () {
    return {
      teal: false,
    }
  }
}
</script>

<style>
.title {
  text-align:center; 
}
.text {
  border: 3px solid black; 
  padding: 25px;
}
</style>