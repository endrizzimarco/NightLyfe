<template lang='pug'>
.q-pa-lg(style='max-width: 1024px')
  .row.justify-center.q-pb-md
    q-btn.bg-grey-2.fixed-top-left.q-ma-sm(@click='$router.go(-1)', icon='arrow_back', label='Back')
    q-avatar(size='9em')
      img(
        src='https://avataaars.io/?avatarStyle=Circle&topType=Eyepatch&facialHairType=Blank&clotheType=ShirtVNeck&clotheColor=Pink&eyeType=Squint&eyebrowType=AngryNatural&mouthType=Default&skinColor=Light'
      )
  q-input.q-py-md(v-model='localDetails.name', label='Full Name', stack-label, :readonly='isEditing')
  q-input.q-pb-md(v-model='localDetails.username', label='Username', stack-label, :readonly='isEditing')
  q-input.q-pb-md(v-model='localDetails.email', label='Email', stack-label, :readonly='isEditing')
    template(v-slot:append)
      q-icon.cursor-pointer(name='event')
        q-menu
  q-input.q-pb-xl(v-model='localDetails.feedback', label='Feedback', stack-label='', autogrow='')
  div
    q-btn(@click='editing = !editing', color='blue', icon='mode_edit', label='Edit')
    q-btn.float-right(@click='saveUserDetails()', icon='mail', color='green', label='Send Feedback')
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      localDetails: {
        name: null,
        username: null,
        email: null,
        feedback: null
      },
      editing: false
    }
  },

  methods: {
    saveUserDetails() {
      this.firebaseUpdateUser({
        userId: this.userDetails.userId,
        updates: this.localDetails
      })

      this.localDetails['userId'] = this.userDetails.userId
      this.setUserDetails(JSON.parse(JSON.stringify(this.localDetails)))

      this.editing = false
    },
    ...mapMutations('firebase', ['setUserDetails']),
    ...mapActions('firebase', ['firebaseUpdateUser'])
  },

  computed: {
    isEditing() {
      return this.editing ? false : true
    },
    ...mapState('firebase', ['userDetails']),
    ...mapGetters('firebase', ['userDetailsKeys'])
  },

  mounted() {
    this.userDetailsKeys.forEach(key => {
      this.localDetails[key] = this.userDetails[key]
    })
  }
}
</script>

<style>
</style>