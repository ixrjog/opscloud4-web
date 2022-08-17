<template>
  <d2-container>
    <template>
      <h1>{{ title }}</h1>
      <el-tabs v-model="activeName">
<!--        <el-tab-pane label="报表" name="report">-->
<!--          <help-desk-report-table ref="helpDeskReportTable"></help-desk-report-table>-->
<!--        </el-tab-pane>-->
        <el-tab-pane label="详情" name="detail">
          <work-event-table @refreshData="refreshData"></work-event-table>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

// Component
import WorkEventTable from '@/components/opscloud/report/workevent/WorkEventTable'

export default {
  name: 'WorkEventReport',
  data () {
    return {
      title: '工作事件',
      activeName: 'detail'
    }
  },
  computed: {},
  mounted () {
  },
  components: {
    WorkEventTable
  },
  methods: {
    refreshData () {
      // this.$refs.helpDeskReportTable.refreshData()
    }
  }
}
</script>

<style scoped>
</style>
