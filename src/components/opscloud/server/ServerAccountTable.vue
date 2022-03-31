<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.name" placeholder="名称"/>
      <el-select v-model="queryParam.protocol" placeholder="选择协议类型" clearable>
        <el-option
          v-for="item in protocolOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="protocol" label="协议">
        <template slot-scope="scope">
          <el-tag size="mini" disable-transitions>{{ scope.row.protocol }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="accountType" label="账户类型">
        <template slot-scope="scope">
          <el-tag size="mini" disable-transitions>{{ scope.row.accountType === 0 ? '普通账户' : '管理员账户' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serverSize" label="服务器数量"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <server-account-editor :formStatus="formStatus.account" ref="serverAccountEditor" :protocolOptions="protocolOptions"
                           :accountTypeOptions="accountTypeOptions"
                           @close="fetchData"></server-account-editor>
  </div>
</template>

<script>

// API
import { QUERY_SERVER_ACCOUNT_PAGE, DELETE_SERVER_ACCOUNT_BY_ID } from '@/api/modules/server/server.account.api.js'
import { GET_SERVER_PROTOCOL_OPTIONS } from '@/api/modules/server/server.api.js'

import Pagination from '../common/page/Pagination'
import ServerAccountEditor from './ServerAccountEditor'

const accountTypeOptions = [
  {
    label: '普通账户',
    value: 0
  },
  {
    label: '管理员账户',
    value: 1
  }
]

export default {
  name: 'ServerAccountTable',
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
      formStatus: {
        account: {
          operationType: true,
          visible: false,
          addTitle: '新增服务器账户配置',
          updateTitle: '更新服务器账户配置'
        }
      },
      options: {
        stripe: true
      },
      queryParam: {
        username: '',
        accountType: '',
        protocol: '',
        extend: true
      },
      accountTypeOptions: accountTypeOptions,
      credentialOptions: [],
      protocolOptions: []
    }
  },
  mounted () {
    this.getProtocolOptions()
    this.fetchData()
  },
  computed: {},
  components: {
    ServerAccountEditor,
    Pagination
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    getProtocolOptions () {
      GET_SERVER_PROTOCOL_OPTIONS()
        .then(res => {
          this.protocolOptions = res.body.options
        })
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_SERVER_ACCOUNT_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleAdd () {
      const serverAccount = {
        id: '',
        username: '',
        credentialId: '',
        credential: {},
        accountType: 0,
        protocol: 'ssh',
        isActive: true,
        comment: ''
      }
      this.$refs.serverAccountEditor.initData(serverAccount)
      this.formStatus.account.operationType = true
      this.formStatus.account.visible = true
    },
    handleRowUpdate (row) {
      this.$refs.serverAccountEditor.initData(Object.assign({}, row))
      this.formStatus.account.operationType = false
      this.formStatus.account.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SERVER_ACCOUNT_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>

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
