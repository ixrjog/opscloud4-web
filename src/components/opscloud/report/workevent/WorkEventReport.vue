<template>
  <div>
    <el-row>
      <el-select v-model="workRoleId" placeholder="选择角色" class="select" @change="initChart">
        <el-option
          v-for="item in workRoleOptions"
          :key="item.id"
          :label="item.workRoleName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="initChart" class="button">刷新</el-button>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="14">
        <work-event-weekly-report ref="workEventWeeklyReport"></work-event-weekly-report>
      </el-col>
      <el-col :span="10">
        <work-event-item-report ref="workEventItemReport"></work-event-item-report>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WorkEventWeeklyReport from '@/components/opscloud/report/workevent/WorkEventWeeklyReport'
import WorkEventItemReport from '@/components/opscloud/report/workevent/WorkEventItemReport'

export default {
  name: 'WorkEventReport',
  props: ['workRoleOptions'],
  data () {
    return {
      workRoleId: ''
    }
  },
  components: {
    WorkEventWeeklyReport,
    WorkEventItemReport
  },
  mounted () {
  },
  methods: {
    initChart () {
      this.$refs.workEventWeeklyReport.fetchData(this.workRoleId)
      this.$refs.workEventItemReport.fetchData(this.workRoleId)
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
