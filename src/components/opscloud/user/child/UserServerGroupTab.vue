<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-select v-model.trim="serverGroupId" clearable filterable
                 remote reserve-keyword placeholder="选择要授权的服务器组" :remote-method="getServerGroup">
        <el-option
          v-for="item in serverGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" plain size="mini" @click="handlerGrant()" :disabled="serverGroupId === ''">授权
      </el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="serverGroupType" label="组类型">
        <template slot-scope="scope">
          <el-tag size="mini" disable-transitions :style="{ color: scope.row.serverGroupType.color }">
            {{ scope.row.serverGroupType.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serverSize" label="服务器数量"></el-table-column>
      <el-table-column prop="userPermission.roleName" label="角色">
        <template slot-scope="scope">
          <el-tag size="mini" :type=" scope.row.userPermission.permissionRole === 'admin' ?   'danger' :'info'">
            {{ scope.row.userPermission.permissionRole === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowSet(scope.row)">
            {{ scope.row.userPermission.permissionRole === 'admin' ? '降权' : '提权' }}
          </el-button>
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
  name: 'UserServerGroupTab',
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
      serverGroupId: '',
      serverGroupOptions: []
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
    init () {
      this.getServerGroup('')
      this.fetchData()
    },
    getServerGroup (name) {
      const requestBody = {
        queryName: name,
        businessType: this.businessType.SERVERGROUP,
        extend: false,
        authorized: false,
        userId: this.user.id,
        page: 1,
        length: 20
      }
      QUERY_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.serverGroupOptions = res.body.data
        })
    },
    handlerRowSet (row) {
      SET_USER_BUSINESS_PERMISSION({ id: row.userPermission.id })
        .then(res => {
          this.$message.success('设置角色成功!')
          this.serverGroupId = ''
          this.fetchData()
        })
    },
    /**
     * 授权
     */
    handlerGrant () {
      const requestBody = {
        userId: this.user.id,
        businessType: this.businessType.SERVERGROUP,
        businessId: this.serverGroupId
      }
      GRANT_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.$message.success('授权成功!')
          this.serverGroupId = ''
          this.getServerGroup('')
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
        businessType: this.businessType.SERVERGROUP,
        businessId: row.id
      }
      REVOKE_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.$message.success('解除成功!')
          this.getServerGroup('')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        businessType: this.businessType.SERVERGROUP,
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
