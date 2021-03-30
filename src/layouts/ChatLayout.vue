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
      q-toolbar-title.absolute-center {{ "NightLyfe" }}
  q-page-container
    router-view
</template>

<script>
</script>