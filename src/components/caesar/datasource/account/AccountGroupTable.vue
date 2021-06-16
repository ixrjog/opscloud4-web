<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handlePull">拉取</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="组名" width="200"></el-table-column>
      <el-table-column prop="accounts" label="关联账户数量" width="100">
        <template slot-scope="scope">
          {{scope.row.accounts.length}}
        </template>
      </el-table-column>
      <el-table-column prop="accounts" label="关联账户">
        <template slot-scope="scope">
          <datasource-accounts-tag :accounts="scope.row.accounts"></datasource-accounts-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import { QUERY_ACCOUNT_GROUP_PAGE, PULL_ACCOUNT_GROUP } from '@/api/modules/datasource/datasource.account.api.js'
import Pagination from '../../common/page/Pagination'
import DatasourceAccountsTag from '../common/DatasourceAccountsTag'

export default {
  name: 'AccountGroupTable',
  props: ['instanceId'],
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
        queryName: '',
        isActive: true,
        extend: true
      }
    }
  },
  computed: {},
  mounted () {
  },
  components: {
    DatasourceAccountsTag,
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
    handlePull () {
      PULL_ACCOUNT_GROUP({ id: this.instanceId })
        .then(res => {
          this.$message.success('后台任务执行中！')
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        instanceId: this.instanceId,
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ACCOUNT_GROUP_PAGE(requestBody)
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

  .el-button {
    margin-left: 5px;
  }
</style>
