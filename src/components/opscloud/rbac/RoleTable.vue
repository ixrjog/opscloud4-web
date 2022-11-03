<template>
  <div>
    <el-row :gutter="24" style="margin-left: 0px;">
      <el-input v-model="queryParam.roleName" placeholder="角色名称"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handleRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="table.data" v-loading="table.loading" style="width: 100%">
      <el-table-column prop="roleName" label="名称" width="300"></el-table-column>
      <el-table-column prop="accessLevel" label="访问等级" width="200"></el-table-column>
      <el-table-column prop="allowOrder" label="工单申请" width="200">
        <template slot-scope="scope">
          <allow-tag :allow="scope.row.allowOrder"></allow-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleEditMenu(scope.row)">菜单</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <!-- role编辑-->
    <role-editor ref="roleEditor" :formStatus="formStatus.role" @close="fetchData"></role-editor>
    <role-menu-editor ref="roleMenuEditor" :formStatus="formStatus.roleMenu"></role-menu-editor>
  </div>
</template>

<script>

import { QUERY_ROLE_PAGE, DELETE_ROLE_BY_ID } from '@/api/modules/auth/auth.role.api.js'
import RoleEditor from './RoleEditor'
import Pagination from '../common/page/Pagination'
import RoleMenuEditor from '@/components/opscloud/rbac/RoleMenuEditor'
import AllowTag from '@/components/opscloud/common/tag/AllowTag'

export default {
  name: 'RbacRoleTable',
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
        roleName: ''
      },
      formStatus: {
        menu: {
          visible: false
        },
        role: {
          visible: false,
          operationType: true,
          addTitle: '新增角色配置',
          updateTitle: '更新角色配置'
        },
        roleMenu: {
          visible: false
        }
      }
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination,
    AllowTag,
    RoleEditor,
    RoleMenuEditor
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
      this.$refs.roleEditor.initData(Object.assign({}, row))
      this.formStatus.role.operationType = false
      this.formStatus.role.visible = true
    },
    handleEditMenu (row) {
      this.$refs.roleMenuEditor.initData(Object.assign({}, row))
      this.formStatus.roleMenu.visible = true
    },
    handleRowAdd () {
      const role = {
        id: '',
        roleName: '',
        accessLevel: 0,
        allowOrder: false,
        comment: ''
      }
      this.$refs.roleEditor.initData(role)
      this.formStatus.role.operationType = true
      this.formStatus.role.visible = true
    },
    handleRowDel (row) {
      DELETE_ROLE_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功！')
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
      QUERY_ROLE_PAGE(requestBody)
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

</style>
