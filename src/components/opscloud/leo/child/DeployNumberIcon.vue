<template>
  <span class="icon">
    <i class="el-icon-loading" v-show="!deploy.isFinish"/>
    <i class="fas fa-hashtag"/>{{ deploy.deployNumber }}
  </span>
</template>

<script>

export default {
  name: 'DeployNumberIcon',
  props: ['deploy']
}
</script>

<style scoped>

</style>
