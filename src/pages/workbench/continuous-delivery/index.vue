<template>
  <d2-container>
    <h1 v-show="false">Leo持续交付</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Build" name="build">
        <continuous-delivery-build-tab ref="continuousDeliveryBuildTab"></continuous-delivery-build-tab>
      </el-tab-pane>
      <el-tab-pane label="Deploy" name="deploy">
        <continuous-delivery-deploy-tab ref="continuousDeliveryDeployTab"></continuous-delivery-deploy-tab>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import continuousDeliveryBuildTab from '@/components/opscloud/leo/ContinuousDeliveryBuildTab'
import continuousDeliveryDeployTab from '@/components/opscloud/leo/ContinuousDeliveryDeployTab'

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
    continuousDeliveryBuildTab,
    continuousDeliveryDeployTab
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'build') {
        this.$refs.continuousDeliveryDeployTab.lineHide()
        return
      }
      if (tab.name === 'deploy') {
        this.$refs.continuousDeliveryDeployTab.lineShow()
      }
    }
  }
}
</script>

<style scoped>

</style>
