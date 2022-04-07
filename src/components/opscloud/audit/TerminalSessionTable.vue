<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.username" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.sessionType" clearable placeholder="会话类型">
        <el-option
          v-for="item in sessionTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="sessionId" label="会话" width="300">
        <template slot-scope="scope">
          <div>
            <user-tag :user="scope.row.user"></user-tag>
          </div>
          <span>{{ scope.row.createTime }}</span>
          <span v-if="scope.row.sessionClosed"> -> {{ scope.row.closeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sessionType" label="会话类型" width="110" sortable>
        <template slot-scope="scope">
          <session-type-tag :sessionType="scope.row.sessionType"></session-type-tag>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户端/服务端" width="250">
        <template slot-scope="scope">
          <el-tag size="mini" style="margin-right: 5px">{{ scope.row.username }}<span
            v-if="scope.row.remoteAddr !== null">@{{ scope.row.remoteAddr }}</span>
          </el-tag>
          <el-tag size="mini">{{ scope.row.serverHostname }}/{{ scope.row.serverAddr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="会话实例">
        <template slot-scope="scope">
          <div class="session-instances">
          <span v-for="sessionInstance in scope.row.sessionInstances" :key="sessionInstance.id">
            <terminal-session-instance-info :sessionInstance="sessionInstance"></terminal-session-instance-info>
          </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import { QUERY_TERMINAL_SESSION_PAGE } from '@/api/modules/terminal/terminal.session.api.js'
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
      queryParam: {
        username: '',
        sessionType: '',
        extend: true
      },
      sessionTypeOptions: sessionTypeOptions
    }
  },
  mounted () {
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
