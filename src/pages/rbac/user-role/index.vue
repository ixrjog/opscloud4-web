<template>
  <d2-container>
      <div>
        <h1>用户角色配置</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-input v-model="queryParam.queryName" placeholder="用户名" class="input-search-bar"/>
          <el-button @click="fetchData" class="search-bar">查询</el-button>
          <!--          <el-button @click="handlerSyncUserRole" class="search-bar">同步</el-button>-->
        </el-row>
      </div>
      <el-table :data="table.data" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="250"></el-table-column>
        <el-table-column prop="displayName" label="显示名" width="250"></el-table-column>
        <el-table-column prop="email" label="email" width="250"></el-table-column>
        <el-table-column prop="roles" label="角色">
          <template slot-scope="scope">
            <role-tags :roles="scope.row.roles"></role-tags>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                     @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="table.pagination.total"
                     :current-page="table.pagination.currentPage"
                     :page-size="table.pagination.pageSize">
      </el-pagination>
      <user-role-editor :form-status="formStatus.role" ref="userRoleEditor" @close="fetchData"></user-role-editor>
  </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { QUERY_USER_PAGE } from '@/api/modules/user/user.api.js'
import RoleTags from '../../../components/caesar/rbac/child/RoleTags'
import UserRoleEditor from '../../../components/caesar/rbac/UserRoleEditor'

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
        queryName: ''
      },
      roleOptions: []
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mounted () {
    this.initPageSize()
    this.fetchData()
  },
  components: {
    UserRoleEditor,
    RoleTags
  },
  methods: {
    ...mapActions({
      setPageSize: 'd2admin/user/set'
    }),
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.info.pageSize = size
      this.setPageSize(this.info)
      this.fetchData()
    },
    initPageSize () {
      if (typeof (this.info.pageSize) !== 'undefined') {
        this.table.pagination.pageSize = this.info.pageSize
      }
    },
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handlerRowEdit (row) {
      this.$refs.userRoleEditor.initData(row)
      this.formStatus.role.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        queryName: this.queryParam.queryName,
        extend: true,
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
