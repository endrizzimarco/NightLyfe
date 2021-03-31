<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-drawer.bg-white(v-model='leftDrawer', show-if-above, bordered, :width='200')
    q-scroll-area(style='height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd')
      q-list.padding
        template(v-for='(menuItem, index) in menuList', :key='index')
          q-item(clickable, v-ripple)
            q-item-section(avatar)
              q-icon(:name='menuItem.icon', :color='menuItem.color')
            q-item-section
              | {{ menuItem.label }}
          q-separator(:key='"sep" + index', v-if='menuItem.separator')
    q-img.absolute-top(src='https://cdn.quasar.dev/img/material.png', style='height: 150px')
      .absolute-bottom.bg-transparent
        q-avatar.q-mb-sm(size='56px')
          img(src='https://cdn.quasar.dev/img/boy-avatar.png')
        .text-weight-bold Razvan Stoenescu
        div @rstoenescu
  q-drawer.bg-white(v-model='rightDrawer', side='right', show-if-above, bordered)
    Friends
  q-dialog(v-model='newEvent', position='bottom')
    EventForm
  q-page-container
    router-view
    q-page-sticky(position='top-left', :offset='[18, 18]')
      q-btn(@click='leftDrawer = !leftDrawer', round, outline, color='cyan-1', icon='more_horiz')
    q-page-sticky(position='bottom-right', :offset='[18, 105]')
      q-btn(@click='rightDrawer = !rightDrawer', fab, color='primary', icon='chat')
    q-page-sticky(position='bottom', :offset='[18, 36]')
      q-fab(vertical-actions-align='center', color='secondary', icon='add', direction='up')
        q-fab-action(color='orange', @click='newEvent = true', icon='add_location', label='New Event')
        q-fab-action(color='accent', icon='notification_add', label='New Signal')
</template>

<script>
import Friends from 'components/Friends.vue'
import EventForm from 'components/EventForm.vue'
import { mapState } from 'vuex'

export default {
  name: 'MainLayout',

  components: {
    Friends,
    EventForm
  },

  data() {
    return {
      leftDrawer: false,
      rightDrawer: false,
      newEvent: false
    }
  },

  computed: {
    ...mapState(['menuList'])
  }
}
</script>
