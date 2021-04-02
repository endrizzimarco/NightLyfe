<template lang='pug'>
.q-pa-lg(style='max-width: 1024px')
  .row.justify-center.q-pb-md
    q-btn.bg-grey-2.fixed-top-left.q-ma-sm(@click='$router.go(-1)', icon='arrow_back', label='Back')
    q-avatar(size='9em')
      img(
        src='https://avataaars.io/?avatarStyle=Circle&topType=Eyepatch&facialHairType=Blank&clotheType=ShirtVNeck&clotheColor=Pink&eyeType=Squint&eyebrowType=AngryNatural&mouthType=Default&skinColor=Light'
      )
  q-input.q-pb-md(v-model='name', label='Full Name', stack-label, :readonly='isEditing')
  q-input.q-pb-md(v-model='username', label='Username', stack-label, :readonly='isEditing')
  q-input.q-pb-md(v-model='password', label='Password', stack-label, :readonly='isEditing')
  q-input.q-pb-md(v-model='email', label='Email', stack-label, :readonly='isEditing')
  q-input.q-pb-md(v-model='phone', label='Phone Number', stack-label, :readonly='isEditing')
  q-input.q-pb-lg(v-model='date', mask='date', :rules='["date"]', label='Date of Birth', :readonly='isEditing')
    template(v-slot:append)
      q-icon.cursor-pointer(name='event')
        q-menu
          q-date(v-model='date', :disable='isEditing')
  .text-subtitle1.text-grey-9.q-pb-sm Gender:
    q-radio.q-pr-sm.q-ml-md(v-model='gender', val='male', label='Male', color='cyan', :disable='isEditing')
    q-radio.q-pr-sm(v-model='gender', val='female', label='Female', color='pink', :disable='isEditing')
    q-radio.q-pr-sm(v-model='gender', val='other', label='Other', color='accent', :disable='isEditing')
  q-input.q-pb-xl(
    v-model='description',
    label='Description',
    stack-label='',
    autogrow='',
    :readonly='editing ? false : true'
  )
  div
    q-btn(@click='editing = !editing', color='blue', icon='mode_edit', label='Edit')
    q-btn.float-right(icon='save', color='green', label='save')
</template>

<script>
export default {
  data() {
    return {
      name: 'Eric Sauce',
      username: 'Er1csauce',
      password: 'Er1csauce14',
      email: 'ek00722@surrey.ac.uk',
      phone: '0123456789',
      date: '2019/02/01',
      gender: 'Male',
      description: 'Very hot lad',
      editing: false
    }
  },

  computed: {
    isEditing() {
      return this.editing ? false : true
    }
  }
}
</script>

<style>
</style>