<template>
  <el-tag v-if="properties['resources.limits.cpu'] !== undefined">
    <span>cpu {{properties['resources.limits.cpu']}} memory {{ properties['resources.limits.memory'] }}</span>
  </el-tag>
</template>

<script>
export default {
  name: 'DeploymentResourcesLimits',
  props: ['properties']
}
</script>

<style scoped>

</style>
