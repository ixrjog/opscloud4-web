<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <workorder-name-stats-report ref="workorderNameStatsReport"></workorder-name-stats-report>
    </el-col>
    <el-col :span="16">
      <workorder-month-stats-report ref="workorderMonthStatsReport"></workorder-month-stats-report>
    </el-col>
  </el-row>
</template>

<script>

import WorkorderNameStatsReport from '@/components/opscloud/workorder/WorkorderNameStatsReport'
import WorkorderMonthStatsReport from '@/components/opscloud/workorder/WorkorderMonthStatsReport'

export default {
  name: 'WorkOrderReport',
  data () {
    return {}
  },
  components: {
    WorkorderNameStatsReport,
    WorkorderMonthStatsReport
  },
  mounted () {
  },
  methods: {
    initData () {
      this.$refs.workorderNameStatsReport.fetchData()
      this.$refs.workorderMonthStatsReport.fetchData()
    }
  }
}
</script>

<style scoped>

</style>
