<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-select v-model.trim="userGroupId" clearable filterable
                 remote reserve-keyword placeholder="选择要授权的用户组" :remote-method="getUserGroup">
        <el-option
          v-for="item in userGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" plain size="mini" @click="handlerGrant()" :disabled="userGroupId === ''">授权
      </el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="handlerRowRevoke(scope.row)">解除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import {
  QUERY_USER_BUSINESS_PERMISSION,
  GRANT_USER_BUSINESS_PERMISSION,
  REVOKE_USER_BUSINESS_PERMISSION,
  SET_USER_BUSINESS_PERMISSION
} from '@/api/modules/user/user.api.js'

import BusinessType from '@/components/opscloud/common/enums/business.type.js'

import Pagination from '../../common/page/Pagination'

export default {
  name: 'UserGroupTab',
  props: ['user'],
  data () {
    return {
      labelWidth: '150px',
      businessType: BusinessType,
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
      userGroupId: '',
      userGroupOptions: []
    }
  },
  mounted () {
  },
  components: {
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
    init(){
      this.getUserGroup('')
      this.fetchData()
    },
    getUserGroup (name) {
      const requestBody = {
        queryName: name,
        businessType: this.businessType.USERGROUP,
        extend: false,
        authorized: false,
        userId: this.user.id,
        page: 1,
        length: 20
      }
      QUERY_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.userGroupOptions = res.body.data
        })
    },
    handlerRowSet (row) {
      SET_USER_BUSINESS_PERMISSION({ id: row.userPermission.id })
        .then(res => {
          this.$message.success('设置角色成功!')
          this.userGroupId = ''
          this.fetchData()
        })
    },
    /**
     * 授权
     */
    handlerGrant () {
      const requestBody = {
        userId: this.user.id,
        businessType: this.businessType.USERGROUP,
        businessId: this.userGroupId
      }
      GRANT_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.$message.success('授权成功!')
          this.userGroupId = ''
          this.getUserGroup('')
          this.fetchData()
        })
    },
    /**
     * 解除
     * @param row
     */
    handlerRowRevoke (row) {
      const requestBody = {
        userId: this.user.id,
        businessType: this.businessType.USERGROUP,
        businessId: row.id
      }
      REVOKE_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.$message.success('解除成功!')
          this.getUserGroup('')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        businessType: this.businessType.USERGROUP,
        userId: this.user.id,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_USER_BUSINESS_PERMISSION(requestBody)
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
