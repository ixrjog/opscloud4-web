<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.finalized" clearable placeholder="完成">
        <el-option v-for="item in taskEndOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="taskUuid" label="任务" width="400">
        <template v-slot="scope">
          <user-tag :user="scope.row.user"/>
          <div>剧本名称: {{ scope.row.taskName }}</div>
          <div>开始: {{ scope.row.startTime }}&lt;{{ scope.row.ago }}&gt;</div>
          <div v-if="scope.row.endTime !== null">结束: {{ scope.row.endTime }}&lt;{{ scope.row.duration }}&gt;</div>
        </template>
      </el-table-column>
      <el-table-column prop="serverTaskMembers" label="详情">
        <template v-slot="scope">
          <div style="margin-bottom: 5px;width: 705px">
            <el-tag size="mini">任务UUID: {{ scope.row.taskUuid }}</el-tag>
            <span style="margin-left: 5px">总计: {{ scope.row.memberSize }}</span>
          </div>
          <el-card shadow="hover" v-for="item in scope.row.serverTaskMembers" :key="item.id">
            <div>{{ item.serverName }} {{ item.manageIp }}
              <env-tag :env="item.env"/>
              <span style="float: right">
                <task-status-tag style="margin-right: 5px" :task-status="item.taskStatus"/>
                <task-result-tag :task-result="item.taskResult"/>
              </span>
            </div>
            <el-row>
              <div>开始: {{ item.startTime }}</div>
              <div v-if="item.endTime !== null">结束: {{ item.endTime }}</div>
              <el-button type="text" @click="handleMemberPlay(item)"><i class="fas fa-play"/> Play
              </el-button>
            </el-row>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column prop="finalized" label="任务状态" width="80">
        <template v-slot="scope">
          <el-tag size="mini" :type="scope.row.finalized ? 'success' : 'warning'">
            <i class="el-icon-loading" v-show="!scope.row.finalized"/>{{ scope.row.finalized ? '完成' : '执行中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowOpenPlaybook(scope.row)">剧本</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowPlay(scope.row)">播放</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <ansible-playbook-editor :formStatus="formStatus.playbook" ref="playbookEditor"/>
  </div>
</template>

<script>

import { QUERY_SERVER_TASK_PAGE } from '@/api/modules/task/server.task.api.js'
import EnvTag from '../common/tag/EnvTag'
import Pagination from '../common/page/Pagination'
import AnsiblePlaybookEditor from './AnsiblePlaybookEditor'
import UserTag from '../common/tag/UserTag'
import TaskStatusTag from '../common/tag/TaskStatusTag'
import TaskResultTag from '../common/tag/TaskResultTag'

const taskEndOptions = [{
  value: true,
  label: '是'
}, {
  value: false,
  label: '否'
}]

export default {
  data () {
    return {
      instance: {
        id: ''
      },
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      formStatus: {
        playbook: {
          operationType: true,
          visible: false,
          addTitle: '新增剧本配置',
          updateTitle: '查看剧本配置'
        }
      },
      queryParam: {
        queryName: '',
        finalized: '',
        extend: true
      },
      taskEndOptions: taskEndOptions
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    AnsiblePlaybookEditor,
    Pagination,
    UserTag,
    EnvTag,
    TaskStatusTag,
    TaskResultTag
  },
  filters: {},
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    handleRowOpenPlaybook (row) {
      this.$refs.playbookEditor.initData(row.playbook)
      this.formStatus.playbook.operationType = false
      this.formStatus.playbook.visible = true
    },
    handleMemberPlay (serverTaskMember) {
      const member = {
        ...serverTaskMember,
        instanceId: serverTaskMember.serverName
      }
      const serverTaskMembers = []
      serverTaskMembers.push(member)
      this.taskPlay(serverTaskMembers)
    },
    handleRowPlay (row) {
      const serverTaskMembers = row.serverTaskMembers.map(e => ({
        ...e,
        instanceId: e.serverName
      }))
      this.taskPlay(serverTaskMembers)
    },
    taskPlay (serverTaskMembers) {
      this.$router.push({
        name: 'task/playbook/play',
        query: {
          serverTaskMembers: JSON.stringify(serverTaskMembers)
        }
      })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SERVER_TASK_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped lang="less">

.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

.el-card {
  margin-bottom: 5px;
  margin-right: 5px;
  width: 400px;
  display: inline-block;
  position: relative;

  /deep/ .el-card__body {
    padding: 10px;
  }

  .el-button {
    position: absolute;
    right: 5px;
    bottom: 0;
  }
}

</style>
