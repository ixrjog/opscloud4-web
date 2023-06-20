<template>
  <span class="icon">
    <i class="el-icon-loading" v-show="!build.isFinish"/>
    <i class="fas fa-hashtag"/>{{ build.buildNumber }}
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
