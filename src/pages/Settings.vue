<template lang='pug'>
.q-pa-md(style='max-width: 350px')
  q-list(bordered, padding)
    q-item-label(header) User Controls
    q-item(clickable, v-ripple)
      q-item-section
        q-item-label Password
        q-item-label(caption) Change your Password
    q-separator(spaced)
    q-item-label(header) General
    q-item(tag='label', v-ripple)
      q-item-section(side, top)
        q-checkbox(v-model='check1')
      q-item-section
        q-item-label Notifications
        q-item-label(caption) Notify me about updates to apps or games that I downloaded
    q-item(tag='label', v-ripple)
      q-item-section(side, top)
        q-checkbox(v-model='check2')
      q-item-section
        q-item-label Dark Mode
        q-item-label(caption) Turn on Darkmode
    q-separator(spaced)
      q-item-label(header) Notifications
      q-item(tag='label', v-ripple)
      q-item-section
        q-item-label Battery too low
      q-item-section(side)
        q-toggle(color='blue', v-model='notif1', val='battery')
    q-item(tag='label', v-ripple)
      q-item-section
        q-item-label Friend request
        q-item-label(caption) Allow notification
      q-item-section(side, top)
        q-toggle(color='green', v-model='notif2', val='friend')
    q-separator(spaced)
    q-item-label(header) Other settings
    q-item
      q-item-section(side)
        q-icon(color='deep-orange', name='brightness_medium')
      q-item-section
        q-slider(v-model='brightness', :min='0', :max='10', label, color='deep-orange')
</template>

<script>
export default {
  data() {
    return {
      check1: true,
      check2: false,
      notif2: true,
      brightness: 3
    }
  }
}
</script>