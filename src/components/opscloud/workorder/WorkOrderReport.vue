<template>
  <div>
    <el-row>
      <el-col>
        <work-order-name-stats-report ref="workOrderNameStatsReport"></work-order-name-stats-report>
      </el-col>
    </el-row>
    <!--  :gutter="20"-->
    <el-row style="margin-top: 10px">
      <work-order-month-stats-report ref="workOrderMonthStatsReport"></work-order-month-stats-report>
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
