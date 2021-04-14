<template lang="pug">
h4(class="title") <mark>Privacy Policy:</mark>
div(class="text")
  p If you have any problems our queries with our app then feel free to contact us using the form below!
  form(class="form")
    label(for="words") Please describe your problem/query here <br>
    input(type="text", id="words", name="words") <br>
    p Do you wish to remain anonymous? (this will prevent us from being able to respond) <br>
    input(type="radio", id="yes", name="anon", value="Y")
    label(for="yes") Yes <br>
    input(type="radio", id="no", name="anon", value="N")
    label(for="no") No <br>
    input(type="submit" value="Submit")
<br>
</template>

<style>
.title {
  text-align:center; 
}
.text {
  border: 3px solid black; 
  padding: 25px;
}
</style>