<template lang="pug">
q-layout(view='lHh Lpr lFf')
  //- Left Drawer 
  q-drawer.bg-white(v-model='leftDrawer', show-if-above, :width='200')
    q-scroll-area(style='height: calc(100% - 150px); margin-top: 150px')
      q-list.padding
        template(v-for='(menuItem, index) in menuList', :key='index')
          q-item(
            @click='menuItem.label == "Logout" ? (confirmLogout = true) : null',
            clickable,
            v-ripple,
            :to='menuItem.link'
          )
            q-item-section(avatar)
              q-icon(:name='menuItem.icon', :color='menuItem.color')
            q-item-section
              | {{ menuItem.label }}
          q-separator(:key='"sep" + index', v-if='menuItem.separator')
    q-img.absolute-top(
      src='https://i.pinimg.com/originals/c6/77/a7/c677a7ca44173bfb724e798729494d19.jpg',
      style='height: 150px'
    )
      .row.absolute-bottom.bg-transparent.justify-center
        q-avatar(size='6.5em', style='margin-top: -95px')
          img(
            src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Round&hairColor=Blonde&facialHairType=BeardMedium&facialHairColor=Blonde&clotheType=Overall&clotheColor=Black&eyeType=Happy&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=Light'
          )
        .text-bold.full-width.text-center {{ userDetails.name }}
        div {{ "@" + userDetails.username }}
  //- Right Drawer
  q-drawer.bg-white(v-model='rightDrawer', side='right', :width='250', show-if-above)
    Friends
  //- Bottom Drawers
  q-dialog(v-model='newEvent', position='bottom')
    EventForm(@submitted='confirmEvent')
  q-dialog(v-model='newSignal', position='bottom')
    SignalForm(@submitted='confirmSignal')
  //- Confirm Logout popup
  q-dialog(v-model='confirmLogout', persistent)
    q-card
      q-card-section.row.items-center.q-pa-sm
        q-avatar(rounded, icon='no_accounts', color='red', text-color='white')
        span.q-ml-sm Are you sure you want to logout?
      q-card-actions(align='right')
        q-btn(flat, label='Cancel', color='primary', v-close-popup)
        q-btn(@click='handleLogout()', flat, label='Confirm', color='primary', v-close-popup)
  //- Page container and floating buttons
  q-page-container
    router-view
    q-page-sticky(position='top-left', :offset='[18, 18]')
      q-btn(@click='leftDrawer = !leftDrawer', round, outline, color='cyan-1', icon='more_horiz')
    q-page-sticky(position='bottom-right', :offset='[18, 105]')
      q-btn(@click='rightDrawer = !rightDrawer', fab, color='primary', icon='chat')
    q-page-sticky(position='bottom', :offset='[18, 36]')
      q-fab(vertical-actions-align='center', color='teal-14', icon='add', direction='up', data-cy='centerBtn')
        q-fab-action(@click='newEvent = true', color='orange', icon='add_location', label='New Event')
        q-fab-action(@click='newSignal = true', color='accent', icon='notification_add', label='New Signal')
</template>

<script>
import Friends from 'components/Friends.vue'
import EventForm from 'components/EventForm.vue'
import SignalForm from 'components/SignalForm.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MainLayout',

  components: {
    Friends,
    EventForm,
    SignalForm
  },

  data() {
    return {
      leftDrawer: false,
      rightDrawer: false,
      newEvent: false,
      newSignal: false,
      confirmLogout: false
    }
  },

  methods: {
    handleLogout() {
      this.$router.push('/auth')
      this.logoutUser()
    },

    confirmSignal() {
      this.newSignal = false
      this.$q.notify({
        message: 'Signal Sent',
        color: 'accent',
        actions: [
          {
            label: '✕',
            color: 'white'
          }
        ]
      })
    },

    confirmEvent() {
      this.newEvent = false
      this.$q.notify({
        message: 'Event Submitted',
        color: 'orange',
        actions: [
          {
            label: '✕',
            color: 'white'
          }
        ]
      })
    },

    ...mapActions('firebase', ['logoutUser'])
  },

  computed: {
    ...mapState(['menuList']),
    ...mapState('firebase', ['userDetails'])
  }
}
</script>
