<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-select v-model.trim="userId" clearable filterable
                 remote reserve-keyword placeholder="选择要授权的用户" :remote-method="getUser">
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.username"
          :value="item.id">
          <select-item :name="item.username" :comment="item.displayName"></select-item>
        </el-option>
      </el-select>
      <el-button type="primary" plain size="mini" @click="handleGrant()" :disabled="userId === ''">授权
      </el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="displayName" label="显示名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="handleRowRevoke(scope.row)">解除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import {
  QUERY_BUSINESS_PERMISSION_USER,
  GRANT_USER_BUSINESS_PERMISSION,
  REVOKE_USER_BUSINESS_PERMISSION,
} from '@/api/modules/user/user.api.js'

import BusinessType from '@/components/opscloud/common/enums/business.type.js'

import Pagination from '../../common/page/Pagination'
import SelectItem from '../../common/SelectItem'

export default {
  // 业务对象授权的用户
  name: 'BusinessPermissionUserTab',
  props: ['businessType', 'businessId'],
  data () {
    return {
      labelWidth: '150px',
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
        extend: true,
        authorized: true
      },
      userId: '',
      userOptions: []
    }
  },
  mounted () {
  },
  components: {
    Pagination,
    SelectItem
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
    init () {
      this.getUser('')
      this.fetchData()
    },
    getUser (name) {
      const requestBody = {
        queryName: name,
        businessType: this.businessType,
        businessId: this.businessId,
        extend: false,
        authorized: false,
        page: 1,
        length: 20
      }
      QUERY_BUSINESS_PERMISSION_USER(requestBody)
        .then(res => {
          this.userOptions = res.body.data
        })
    },
    /**
     * 授权
     */
    handleGrant () {
      const requestBody = {
        userId: this.userId,
        businessType: this.businessType,
        businessId: this.businessId
      }
      GRANT_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.$message.success('授权成功!')
          this.userId = ''
          this.getUser('')
          this.fetchData()
        })
    },
    /**
     * 解除
     * @param row
     */
    handleRowRevoke (row) {
      const requestBody = {
        userId: row.id,
        businessType: this.businessType,
        businessId: this.businessId
      }
      REVOKE_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.$message.success('解除成功!')
          this.getUser('')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        businessType: this.businessType,
        businessId: this.businessId,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_BUSINESS_PERMISSION_USER(requestBody)
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

  .el-select {
    display: inline-block;
    width: 250px;
  }

  .el-input {
    display: inline-block;
    max-width: 200px;
  }

  .el-button {
    margin-left: 5px;
  }

</style>