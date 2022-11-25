<template>
  <span class="icon">
    <i class="el-icon-loading" v-show="!build.isFinish"></i>
    <i class="fas fa-hashtag"></i>{{ build.buildNumber }}
  </span>
</template>

<script>

export default {
  name: 'BuildNumberIcon',
  props: ['build']
}
</script>

<style scoped>

</style>
