<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <template>
      <h1 v-if="false">{{ title }}</h1>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="持续交付报表" name="report">
          <continuous-delivery-report ref="continuousDeliveryReport"/>
        </el-tab-pane>
        <el-tab-pane label="作业监控" name="monitor">
          <continuous-delivery-monitor ref="continuousDeliveryMonitor"/>
        </el-tab-pane>
        <el-tab-pane label="持续交付Prod报表" name="prodReport">
          <continuous-delivery-prod-report ref="continuousDeliveryProdReport"/>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

import ContinuousDeliveryReport from '@/components/opscloud/report/leo/ContinuousDeliveryReport.vue'
import ContinuousDeliveryMonitor from '@/components/opscloud/report/leo/ContinuousDeliveryMonitor.vue'
import ContinuousDeliveryProdReport from '@/components/opscloud/report/leo/ContinuousDeliveryProdReport.vue'

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
    ContinuousDeliveryMonitor,
    ContinuousDeliveryProdReport
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
      if (tab.name === 'prodReport') {
        this.$refs.continuousDeliveryProdReport.fetchData()
      }
    }
  }
}
</script>

<style scoped>
</style>
