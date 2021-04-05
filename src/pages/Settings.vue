<template lang='pug'>
//- q-btn.bg-grey-2f.float-left.q-ma-sm(@click='$router.go(-1)', icon='arrow_back', label='Back')
q-list.q-pa-sm(bordered, style='max-width: 1000px')
  q-item-label.text-h5(header) Settings
  q-item-label(header) User Controls
  q-item
    q-item-section
      q-item-label Password
        q-expansion-item(label='Change Password')
          q-card
            q-card-section
              q-input.q-pb-md(v-model='OldPassword', label='Old Password', stack-label)
              q-input.q-pb-md(v-model='NewPassword', label='New Password', stack-label)
            q-btn.float-right(icon='save', color='green', label='save')
  q-separator(spaced)
  q-item-label(header) General
  q-item(tag='label', v-ripple)
    q-item-section(side, top)
      q-checkbox(v-model='check1')
    q-item-section
      q-item-label Notifications
      q-item-label(caption) Notify me about updates
  q-item(tag='label', v-ripple)
    q-item-section(side, top)
      q-checkbox(v-model='check2')
    q-item-section
      q-item-label Dark Mode
      q-item-label(caption, @click='darkThemeSwitch') Turn on Darkmode

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
import { useQuasar } from 'quasar'
export default {
  data() {
    return {
      check1: true,
      check2: false,
      notif2: true,
      brightness: 3
    }
    // },
    // methods: {
    //   _addDarkTheme() {
    //     let darkThemeLinkEl = document.createElement('link')
    //     darkThemeLinkEl.setAttribute('rel', 'stylesheet')
    //     darkThemeLinkEl.setAttribute('href', '/css/darktheme.css')
    //     darkThemeLinkEl.setAttribute('id', 'dark-theme-style')

    //     let docHead = document.querySelector('head')
    //     docHead.append(darkThemeLinkEl)
    //   },
    //   _removeDarkTheme() {
    //     let darkThemeLinkEl = document.querySelector('#dark-theme-style')
    //     let parentNode = darkThemeLinkEl.parentNode
    //     parentNode.removeChild(darkThemeLinkEl)
    //   },
    //   darkThemeSwitch() {
    //     let darkThemeLinkEl = document.querySelector('#dark-theme-style')
    //     if (!darkThemeLinkEl) {
    //       this._addDarkTheme()
    //     } else {
    //       this._removeDarkTheme()
    //     }
    //   }
    // }
  }
}
</script>