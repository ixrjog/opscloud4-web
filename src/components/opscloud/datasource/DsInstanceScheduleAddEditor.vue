<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog title="新增数据源实例动态分布式任务" :visible.sync="formStatus.visible" append-to-body width="40%">
    <el-form :model="scheduleJob" label-width="80px">
      <el-form-item label="任务类型" required>
        <el-select v-model="scheduleJob.jobType" placeholder="选择类型">
          <el-option v-for="item in jobTypeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资产类型" required>
        <el-select v-model="scheduleJob.assetType" placeholder="选择资产类型">
          <el-option v-for="item in assetTypeOptions"
                     :key="item.assetType"
                     :label="item.assetType"
                     :value="item.assetType"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Cron" required>
        <el-input v-model="scheduleJob.jobTime" @change="handleChange">
          <el-button slot="append" @click="handleCheck()" :icon="cronChecked?'el-icon-success':'el-icon-warning'"/>
        </el-input>
        <el-alert title="最近5次执行时间" type="info" v-if="showExecutionTime" style="margin-top: 5px"
                  :closable="false">
          <div v-for="time in executionTime" :key="time">{{ time }}</div>
        </el-alert>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input type="textarea" v-model="scheduleJob.jobDescription"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  ADD_DATASOURCE_INSTANCE_SCHEDULE,
  DATASOURCE_INSTANCE_SCHEDULE_CRON_CHECK
} from '@/api/modules/datasource/datasource.schedule.api'

const scheduleJob = {
  jobType: 'AssetPullJob',
  instanceId: '',
  assetType: '',
  jobTime: ''
}

export default {
  name: 'DsInstanceScheduleAddEditor',
  props: ['formStatus'],
  data () {
    return {
      jobTypeOptions: [{
        value: 'AssetPullJob',
        label: '资产拉取'
      }],
      assetTypeOptions: [],
      scheduleJob: {},
      executionTime: [],
      showExecutionTime: false,
      cronChecked: false
    }
  },
  mixins: [],
  components: {},
  methods: {
    initData (instance) {
      this.scheduleJob = Object.assign({}, scheduleJob)
      this.scheduleJob.instanceId = instance.id
      this.assetTypeOptions = instance.assetDetails
      this.executionTime = []
      this.showExecutionTime = false
      this.cronChecked = false
    },
    handleChange () {
      this.scheduleJob.jobTime = this.scheduleJob.jobTime.trim()
    },
    handleAdd () {
      if (!this.cronChecked) {
        return this.$message.warning('请先校验Cron表达式')
      }
      ADD_DATASOURCE_INSTANCE_SCHEDULE(this.scheduleJob)
        .then(() => {
          this.$message.success('新增任务成功')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleCheck () {
      this.executionTime = []
      DATASOURCE_INSTANCE_SCHEDULE_CRON_CHECK({ jobTime: this.scheduleJob.jobTime.trim() })
        .then(({ body }) => {
          if (JSON.stringify(body) === '[]') {
            return this.$message.error('Cron表达式异常')
          }
          this.executionTime = body
          this.showExecutionTime = true
          this.cronChecked = true
        })
    }
  }
}
</script>

<style scoped>

</style>
