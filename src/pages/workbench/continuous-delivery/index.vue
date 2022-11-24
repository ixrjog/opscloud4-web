<template>
  <d2-container>
    <h1>Leo持续交付</h1>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="Build" name="build">
        <continuous-delivery-build-tab></continuous-delivery-build-tab>
      </el-tab-pane>
      <el-tab-pane label="Deploy" name="deploy"></el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import continuousDeliveryBuildTab from '@/components/opscloud/leo/ContinuousDeliveryBuildTab'

export default {
  name: 'continuous-delivery',
  data () {
    return {
      activeName: 'build'
    }
  },
  mounted () {
  },
  components: {
    continuousDeliveryBuildTab
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
