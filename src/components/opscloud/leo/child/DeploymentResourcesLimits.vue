<!--suppress HtmlUnknownTag -->
<template>
  <span>
      <el-tag v-if="!simple && properties['resources.limits.cpu'] !== undefined" size="mini">
    <span>
      {{ CPU }} {{ properties['resources.limits.cpu'] }} {{ Memory }} {{ properties['resources.limits.memory'] }}
    </span>
  </el-tag>
  <span v-if="simple">
    {{ CPU }} {{ properties['resources.limits.cpu'] }} {{ Memory }} {{properties['resources.limits.memory']}}
  </span>
  </span>
</template>

<script>

export default {
  name: 'DeploymentResourcesLimits',
  props: {
    properties: {
      type: Object,
      required: true,
      default: () => ({})
    },
    simple: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      CPU: 'cpu',
      Memory: 'mem'
    }
  }
}
</script>

<style scoped>

</style>
