<template>
  <span class="icon">
    <i class="el-icon-loading" v-show="!deploy.isFinish"></i>
    <i class="fas fa-hashtag"></i>{{ deploy.deployNumber }}
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
