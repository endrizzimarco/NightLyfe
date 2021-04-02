<template lang="pug">
q-layout(view='lHh lpr lff')
  q-header(elevated)
    q-toolbar
      q-btn(
        v-if='$route.fullPath.includes("/chat")',
        @click='$router.go(-1)',
        icon='arrow_back',
        flat,
        dense,
        label='Back'
      )
      q-toolbar-title.absolute-center.q-pl-xl {{ otherUserDetails.name }}
        q-badge.q-ml-sm(
          rounded,
          align='middle',
          :color='otherUserDetails.online ? "green" : "red"',
          :label='otherUserDetails.online ? "online" : "offline"'
        )
  q-page-container
    router-view
</template>

<script>
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

export default {
  mixins: [mixinOtherUserDetails]
}
</script>