<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-col>
        <work-order-name-stats-report ref="workOrderNameStatsReport"/>
      </el-col>
    </el-row>
    <div style="height: 5px"/>
    <el-row>
      <work-order-month-stats-report ref="workOrderMonthStatsReport"/>
    </el-row>
  </div>
</template>

<script>

import WorkOrderNameStatsReport from '@/components/opscloud/workorder/WorkOrderNameStatsReport'
import WorkOrderMonthStatsReport from '@/components/opscloud/workorder/WorkOrderMonthStatsReport'

export default {
  name: 'WorkOrderReport',
  data () {
    return {}
  },
  components: {
    WorkOrderNameStatsReport,
    WorkOrderMonthStatsReport
  },
  mounted () {
  },
  methods: {
    initData () {
      this.$refs.workOrderNameStatsReport.fetchData()
      this.$refs.workOrderMonthStatsReport.fetchData()
    }
  }
}
</script>

<style scoped>

</style>
