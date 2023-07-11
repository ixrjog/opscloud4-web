<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-input v-model="queryParam.username"  size="mini" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.sessionType" size="mini" clearable placeholder="会话类型">
        <el-option v-for="item in sessionTypeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-select v-model="queryParam.serverHostname" size="mini" clearable placeholder="会话实例">
        <el-option v-for="item in instanceOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.name"/>
      </el-select>
      <el-select v-model="queryParam.sessionClosed" size="mini" clearable placeholder="会话状态">
        <el-option v-for="item in sessionStatusOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" size="mini" class="button">查询</el-button>
      <el-button @click="handleBatchClose" size="mini" class="button" :disabled="multipleSelection.length === 0">批量关闭
      </el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" ref="multipleTable"
              @selection-change="handleSelectionChange" tooltip-effect="dark">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="sessionId" label="会话" width="350">
        <template v-slot="scope">
          <div>
            <user-tag :user="scope.row.user" v-if="scope.row.user"/>
          </div>
          <!--          用户端@服务端-->
          <div>
            <span>{{ scope.row.username }}<span v-if="scope.row.remoteAddr !== null">[{{ scope.row.remoteAddr }}]</span></span>
            <span>@{{ scope.row.serverHostname }}[{{ scope.row.serverAddr }}]</span>
          </div>
          <span>{{ scope.row.createTime }}</span>
          <span v-if="scope.row.sessionClosed"> -> {{ scope.row.closeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sessionType" label="会话类型" width="110" sortable>
        <template v-slot="scope">
          <session-type-tag :sessionType="scope.row.sessionType"/>
        </template>
      </el-table-column>
      <el-table-column label="会话实例">
        <template v-slot="scope">
          <div class="session-instances">
          <span v-for="sessionInstance in scope.row.sessionInstances" :key="sessionInstance.id">
            <terminal-session-instance-info :sessionInstance="sessionInstance"/>
          </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-button type="danger" plain size="mini" v-if="scope.row.sessionClosed === false"
                     @click="handleClose(scope.row)">关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
  </div>
</template>

<script>

import {
  QUERY_TERMINAL_SESSION_PAGE,
  CLOSE_TERMINAL_SESSION_BY_ID,
  BATCH_CLOSE_TERMINAL_SESSION
} from '@/api/modules/terminal/terminal.session.api.js'
import { QUERY_INSTANCE_PAGE } from '@/api/modules/sys/sys.instance.api.js'
import Pagination from '../common/page/Pagination'
import SessionTypeTag from '../common/tag/SessionTypeTag'
import TerminalSessionInstanceInfo from '../terminal/TerminalSessionInstanceInfo'
import UserTag from '../common/tag/UserTag'

const sessionTypeOptions = [{
  value: 'WEB_TERMINAL',
  label: 'WEB终端'
}, {
  value: 'KUBERNETES_TERMINAL',
  label: 'KUBERNETES终端'
}, {
  value: 'SSH_SERVER',
  label: 'SSH服务器'
}]

const sessionStatusOptions = [{
  value: false,
  label: '活跃'
}, {
  value: true,
  label: '关闭'
}]

export default {
  data () {
    return {
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      multipleSelection: [],
      queryParam: {
        username: '',
        sessionType: '',
        sessionClosed: null,
        serverHostname: '',
        extend: true
      },
      instanceOptions: [],
      sessionTypeOptions: sessionTypeOptions,
      sessionStatusOptions: sessionStatusOptions
    }
  },
  mounted () {
    this.getInstance()
    this.fetchData()
  },
  computed: {},
  components: {
    Pagination,
    SessionTypeTag,
    TerminalSessionInstanceInfo,
    UserTag
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
    getInstance () {
      const requestBody = {
        extend: false,
        page: 1,
        length: 10
      }
      QUERY_INSTANCE_PAGE(requestBody)
        .then(res => {
          this.instanceOptions = res.body.data
        })
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    /**
     * 强制关闭会话
     */
    handleClose (row) {
      CLOSE_TERMINAL_SESSION_BY_ID(row.id)
        .then(res => {
          this.$message.success('会话已关闭!')
          this.fetchData()
        })
    },
    handleBatchClose () {
      const requestBody = {
        ids: this.multipleSelection.map(e => (e.id))
      }
      BATCH_CLOSE_TERMINAL_SESSION(requestBody)
        .then(res => {
          this.$message.success('会话已关闭!')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_TERMINAL_SESSION_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>

.session-instances {
  display: flex;
  flex-wrap: wrap;

  .terminal-session-instance-info {
    margin-bottom: 4px;
    flex-grow: 1;
    flex-basis: 50%;
  }
}

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

</style>
