<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :visible.sync="formStatus.visible" width="70%">
    <template v-slot:title>
      <b>数据源实例-资产 动态分布式任务</b>
      <el-button @click="handleAdd" size="mini" plain style="margin-left: 5px">新增</el-button>
    </template>
    <el-table :data="schedules" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="任务名称" width="150"/>
      <el-table-column prop="cronExpression" label="CRON表达式" width="100">
        <template v-slot="scope">
          <span>{{ scope.row.cronExpression }}</span>
          <el-popover placement="right" trigger="hover" title="最近5次执行时间">
            <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"/>
            <div v-for="time in scope.row.executionTime" :key="time">{{ time }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template v-slot="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="120"/>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button type="primary" size="mini" plain @click="handleScheduleResume(scope.row)"
                     v-if="scope.row.status === 'PAUSED'">恢复
          </el-button>
          <el-button type="primary" size="mini" plain @click="handleSchedulePause(scope.row)"
                     v-if="scope.row.status === 'NORMAL'">暂停
          </el-button>
          <el-button type="danger" size="mini" plain @click="handleScheduleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
    <ds-instance-schedule-add-editor :form-status="addEditorStatus" @close="fetchData"
                                     ref="dsInstanceScheduleAddEditor"/>
  </el-dialog>
</template>

<script>
import DsInstanceScheduleAddEditor from '@/components/opscloud/datasource/DsInstanceScheduleAddEditor'
import {
  DELETE_DATASOURCE_INSTANCE_SCHEDULE, PAUSE_DATASOURCE_INSTANCE_SCHEDULE,
  QUERY_DATASOURCE_INSTANCE_SCHEDULE_BY_ID, RESUME_DATASOURCE_INSTANCE_SCHEDULE
} from '@/api/modules/datasource/datasource.schedule.api'
import TicketTitle from '@/components/opscloud/workorder/child/TicketTitle.vue'

export default {
  name: 'DsInstanceScheduleEditor',
  props: ['formStatus'],
  data () {
    return {
      labelWidth: '150px',
      schedules: [],
      instance: {},
      addEditorStatus: {
        visible: false
      },
      loading: false
    }
  },
  components: {
    TicketTitle,
    DsInstanceScheduleAddEditor
  },
  methods: {
    initData (instance) {
      this.instance = Object.assign({}, instance)
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      QUERY_DATASOURCE_INSTANCE_SCHEDULE_BY_ID({ id: this.instance.id })
        .then(({ body }) => {
          this.schedules = body
          this.loading = false
        })
    },
    handleAdd () {
      this.$refs.dsInstanceScheduleAddEditor.initData(this.instance)
      this.addEditorStatus.visible = true
    },
    handleScheduleDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestBody = {
          group: row.group,
          name: row.name
        }
        DELETE_DATASOURCE_INSTANCE_SCHEDULE(requestBody)
          .then(() => {
            this.fetchData()
            this.$message.success('删除成功!')
          })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleScheduleResume (row) {
      const requestBody = {
        group: row.group,
        name: row.name
      }
      RESUME_DATASOURCE_INSTANCE_SCHEDULE(requestBody)
        .then(() => {
          this.fetchData()
          this.$message.success('恢复成功!')
        })
    },
    handleSchedulePause (row) {
      const requestBody = {
        group: row.group,
        name: row.name
      }
      PAUSE_DATASOURCE_INSTANCE_SCHEDULE(requestBody)
        .then(() => {
          this.fetchData()
          this.$message.success('暂停成功!')
        })
    }
  }
}
</script>

<style scoped>

</style>
