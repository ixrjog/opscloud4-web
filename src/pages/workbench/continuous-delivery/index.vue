<template>
  <d2-container @scroll="({x, y}) => handleScroll(y)">
    <h1 v-show="false">持续交付2.0</h1>
    <announcement-carousel :kind="1"></announcement-carousel>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Build" name="build">
        <continuous-delivery-build-tab ref="cDBuildTab"></continuous-delivery-build-tab>
      </el-tab-pane>
      <el-tab-pane label="Deploy" name="deploy">
        <continuous-delivery-deploy-tab ref="cDDeployTab"></continuous-delivery-deploy-tab>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: 20px">
      <document-zone mount-zone="LEO_CD"></document-zone>
    </el-row>
  </d2-container>
</template>

<script>

import continuousDeliveryBuildTab from '@/components/opscloud/leo/ContinuousDeliveryBuildTab'
import continuousDeliveryDeployTab from '@/components/opscloud/leo/ContinuousDeliveryDeployTab'
import AnnouncementCarousel from '@/components/opscloud/sys/AnnouncementCarousel.vue'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  name: 'continuous-delivery',
  data () {
    return {
      activeName: 'build',
      scrollTop: 0
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'continuous-delivery') {
        // 进入
        if (this.activeName === 'deploy') {
          this.$refs.cDDeployTab.lineShow()
        }
      } else {
        // 离开
        this.$refs.cDDeployTab.lineHide()
      }
    }
  },
  mounted () {
  },
  components: {
    AnnouncementCarousel,
    continuousDeliveryBuildTab,
    continuousDeliveryDeployTab,
    DocumentZone
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'build') {
        this.$refs.cDDeployTab.lineHide()
        return
      }
      if (tab.name === 'deploy') {
        this.$refs.cDDeployTab.lineShow()
      }
    },
    handleScroll (y) {
      this.$refs.cDDeployTab.scroll(y)
    }
  }
}
</script>

<style scoped>

</style>
