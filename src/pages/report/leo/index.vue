<template>
  <d2-container>
    <template>
      <h1 v-if="false">{{ title }}</h1>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="持续交付报表" name="report">
          <continuous-delivery-report ref="continuousDeliveryReport"></continuous-delivery-report>
        </el-tab-pane>
        <el-tab-pane label="作业监控" name="monitor">
          <continuous-delivery-monitor ref="continuousDeliveryMonitor"></continuous-delivery-monitor>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

import ContinuousDeliveryReport from '@/components/opscloud/report/leo/ContinuousDeliveryReport.vue'
import ContinuousDeliveryMonitor from '@/components/opscloud/report/leo/ContinuousDeliveryMonitor.vue'

export default {
  name: 'ContinuousDelivery',
  data () {
    return {
      title: '持续交付',
      activeName: 'report'
    }
  },
  computed: {},
  mounted () {
    this.$nextTick(() => {
      this.$refs.continuousDeliveryReport.fetchData()
    }, 100)
  },
  components: {
    ContinuousDeliveryReport,
    ContinuousDeliveryMonitor
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'report') {
        this.$refs.continuousDeliveryReport.fetchData()
        return
      }
      if (tab.name === 'monitor') {
        this.$refs.continuousDeliveryMonitor.start()
      }
    }
  }
}
</script>

<style scoped>
</style>
