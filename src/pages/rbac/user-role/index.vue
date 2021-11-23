<template>
  <d2-container>
    <div>
      <h1>用户角色配置</h1>
    </div>
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model="queryParam.queryName" placeholder="用户名" class="input-search-bar"/>
        <el-checkbox label="过滤系统用户" v-model="queryParam.filterSystemUser" style="margin-left: 5px"></el-checkbox>
        <el-button @click="fetchData" class="search-bar">查询</el-button>
        <!--          <el-button @click="handlerSyncUserRole" class="search-bar">同步</el-button>-->
      </el-row>
    </div>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="displayName" label="显示名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
      <el-table-column prop="roles" label="角色">
        <template slot-scope="scope">
          <role-tags :roles="scope.row.roles"></role-tags>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template slot-scope="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="warning" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <user-role-editor :form-status="formStatus.role" ref="userRoleEditor" @close="fetchData"></user-role-editor>
  </d2-container>
</template>

<script>

import { QUERY_USER_PAGE } from '@/api/modules/user/user.api.js'
import RoleTags from '../../../components/opscloud/rbac/child/RoleTags'
import UserRoleEditor from '../../../components/opscloud/rbac/UserRoleEditor'
import Pagination from '../../../components/opscloud/common/page/Pagination'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'

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
      formStatus: {
        role: {
          visible: false
        }
      },
      queryParam: {
        queryName: '',
        filterSystemUser: true,
        extend: true
      },
      roleOptions: []
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination,
    UserRoleEditor,
    RoleTags,
    BusinessTags
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
    handleRowEdit (row) {
      this.$refs.userRoleEditor.initData(row)
      this.formStatus.role.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_USER_PAGE(requestBody)
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
.input-search-bar {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.search-bar {
  margin-left: 5px;
}

</style>
