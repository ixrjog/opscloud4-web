<template>
  <el-tag v-if="properties['resources.limits.cpu'] !== undefined">
    <span>{{ CPU }} {{properties['resources.limits.cpu']}} {{ Memory }} {{ properties['resources.limits.memory'] }}</span>
  </el-tag>
</template>

<script>

export default {
  name: 'DeploymentResourcesLimits',
  props: ['properties'],
  data () {
    return {
      CPU: 'cpu',
      Memory: 'mem'
    }
  },
}
</script>

<style scoped>

</style>
