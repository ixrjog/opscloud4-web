<template>
  <d2-container>
    <template>
      <h1>{{ title }}</h1>
      <el-tabs v-model="activeName">
        <el-tab-pane label="报表" name="report">
          <work-event-report ref="workEventReport" :work-role-options="workRoleOptions"></work-event-report>
        </el-tab-pane>
        <el-tab-pane label="详情" name="detail">
          <work-event-table @refreshData="refreshData" :work-role-options="workRoleOptions"></work-event-table>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

// Component
import WorkEventTable from '@/components/opscloud/report/workevent/WorkEventTable'
import workEventReport from '@/components/opscloud/report/workevent/WorkEventReport'
import { QUERY_WORK_ROLE } from '@/api/modules/report/workevent/work.event.api'

export default {
  name: 'WorkEvent',
  data () {
    return {
      title: '工作事件',
      activeName: 'report',
      workRoleOptions: []
    }
  },
  computed: {},
  mounted () {
    this.getWorkRole()
  },
  components: {
    WorkEventTable,
    workEventReport
  },
  methods: {
    refreshData () {
      // this.$refs.helpDeskReportTable.refreshData()
    },
    getWorkRole () {
      this.workRoleOptions = []
      QUERY_WORK_ROLE().then(({ body }) => {
        this.workRoleOptions = body
      })
    }
  }
}
</script>

<style scoped>
</style>
