<template>
  <div>
    <el-row>
      <el-select v-model="workRole" placeholder="选择角色" class="select" @change="initChart" value-key="id">
        <el-option
          v-for="item in workRoleOptions"
          :key="item.id"
          :label="item.workRoleName"
          :value="item">
        </el-option>
      </el-select>
      <el-button @click="initChart" class="button">刷新</el-button>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="10">
        <work-event-item-report ref="workEventItemReport"></work-event-item-report>
      </el-col>
      <el-col :span="14">
        <work-event-weekly-report ref="workEventWeeklyReport"></work-event-weekly-report>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <span v-if="JSON.stringify(workRole) !== '{}' && workRole.workRoleKey ==='SUPPORT'">
        <el-col :span="12" style="margin-bottom: 10px">
          <work-event-intercept-report ref="workEventInterceptReport"></work-event-intercept-report>
        </el-col>
        <el-col :span="12" style="margin-bottom: 10px">
          <work-event-time-report ref="workEventTimeReport"></work-event-time-report>
        </el-col>
        <el-col :span="12" style="margin-bottom: 10px">
          <work-event-solve-report ref="workEventSolveReport"></work-event-solve-report>
        </el-col>
        <el-col :span="12" style="margin-bottom: 10px">
          <work-event-fault-report ref="workEventFaultReport"></work-event-fault-report>
        </el-col>
      </span>
    </el-row>
  </div>
</template>

<script>
import WorkEventWeeklyReport from '@/components/opscloud/report/workevent/WorkEventWeeklyReport'
import WorkEventItemReport from '@/components/opscloud/report/workevent/WorkEventItemReport'
import WorkEventFaultReport from '@/components/opscloud/report/workevent/WorkEventFaultReport'
import WorkEventInterceptReport from '@/components/opscloud/report/workevent/WorkEventInterceptReport'
import WorkEventSolveReport from '@/components/opscloud/report/workevent/WorkEventSolveReport'
import WorkEventTimeReport from '@/components/opscloud/report/workevent/WorkEventTimeReport'

export default {
  name: 'WorkEventReport',
  props: ['workRoleOptions'],
  data () {
    return {
      workRole: {}
    }
  },
  components: {
    WorkEventWeeklyReport,
    WorkEventItemReport,
    WorkEventFaultReport,
    WorkEventInterceptReport,
    WorkEventSolveReport,
    WorkEventTimeReport
  },
  mounted () {
  },
  methods: {
    initChart () {
      this.$refs.workEventWeeklyReport.fetchData(this.workRole.id)
      this.$refs.workEventItemReport.fetchData(this.workRole.id)
    }
  }
}
</script>

<style scoped lang="less">
.button {
  margin-left: 5px;
}

.el-row {
  margin-bottom: 10px;
}
</style>
