<template lang="pug">
q-card.full-width
  //- Create Event Header
  q-card-section.bg-blue-grey-1(style='padding: 8px')
    span.text-subtitle1.text-weight-light.text-blue-grey-10 Create your event
    q-chip.float-right(
      @click='submitEvent()',
      clickable,
      color='primary',
      text-color='white',
      icon='done',
      style='margin-top: -1px'
    ) Submit Event
  //- Create Event Form
  q-card-section
    //- Event name field
    .row.q-pb-md
      q-input.full-width(
        v-model='name',
        rounded,
        outlined,
        :dense='true',
        label='Event Name',
        placeholder='Birthday Party'
      )
        template(v-slot:before)
          span.text-subtitle1.text-blue-grey-10 Name of your Event:&nbsp&nbsp
    //- Date and Time field
    span.text-subtitle1.text-blue-grey-10.q-pt-sm Date and Time:
    .row.q-pb-md.no-wrap
      q-input.full-width(v-model='date', rounded, outlined, type='date', :dense='true', hint='Date of Event')
      q-input.q-ml-sm(v-model='time', rounded, outlined, type='time', :dense='true', hint='Time of the Event')
    //- Location of Event field
    .row.q-pb-md
      span.text-subtitle1.text-blue-grey-10 Where?:
      q-input.full-width(rounded, outlined, v-model='places', label='Search places', :dense='true')
        template(v-slot:prepend)
          q-icon(name='place')
        template(v-slot:append)
          q-icon.cursor-pointer(name='search', @click='searchPlaces()')
    //- Invite friends field
    .row.q-pb-md
      span.text-subtitle1.text-blue-grey-10 Invite your friends:
      q-input.full-width(rounded, outlined, v-model='friends', label='Search friends', :dense='true')
        template(v-slot:prepend)
          q-icon(name='person_add')
        template(v-slot:append)
          q-icon.cursor-pointer(name='search', @click='searchFriends()')
    //- Event icon field
    .text-subtitle1.text-blue-grey-10 Choose an icon for your Event:
    .row.q-pb-md.justify-around
      img(src='https://img.icons8.com/dusk/50/000000/home.png')
      img(src='https://img.icons8.com/dusk/50/000000/party-baloons.png')
      img(src='https://img.icons8.com/dusk/50/000000/dancing-party.png')
      img(src='https://img.icons8.com/dusk/50/000000/cocktail.png')
      img(src='https://img.icons8.com/dusk/50/000000/home.png')
      img(src='https://img.icons8.com/wired/50/000000/cocktail.png')
    //- Event details field
    .row
      span.text-subtitle1.text-blue-grey-10 Details:
      q-input.full-width(
        rounded,
        outlined,
        autogrow,
        v-model='details',
        placeholder='Dress code, specifications, directions etc.',
        :dense='true'
      )
</template>

<script>
export default {
  data() {
    return {
      name: null,
      date: null,
      time: null,
      places: null,
      friends: null,
      details: null
    }
  },
  methods: {
    searchPlaces() {
      console.log('searching places')
    },
    searchFriends() {
      console.log('searching friends')
    },
    submitEvent() {
      console.log('submit event')
    }
  }
}
</script>