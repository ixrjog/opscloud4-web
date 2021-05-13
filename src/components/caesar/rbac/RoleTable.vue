<template>
  <div>
    <el-row :gutter="24" style="margin-left: 0px;">
      <el-input v-model="queryParam.roleName" placeholder="角色名称"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handlerRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="table.data" v-loading="table.loading" style="width: 100%">
      <el-table-column prop="roleName" label="名称" width="300"></el-table-column>
      <el-table-column prop="accessLevel" label="访问等级" width="200"></el-table-column>
      <el-table-column prop="inWorkorder" label="工单申请" width="200">
        <template slot-scope="scope">
          <whether-tag :whether="scope.row.allowWorkorder"></whether-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
          <!--                    <el-button type="primary" plain size="mini" @click="editMenu(scope.row)">菜单</el-button>-->
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="table.pagination.total" :current-page="table.pagination.currentPage"
                   :page-size="table.pagination.pageSize">
    </el-pagination>
    <!-- role编辑-->
    <role-editor ref="roleEditor" :formStatus="formStatus.role" @close="fetchData"></role-editor>
    <!--    <MenuDialog :formStatus="formMenuStatus" ref="menuDialog"></MenuDialog>-->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { QUERY_ROLE_PAGE, DELETE_ROLE_BY_ID } from '@/api/modules/auth/auth.role.api.js'
import RoleEditor from './RoleEditor'
import WhetherTag from '../common/tag/WhetherTag'

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
        }
      }
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
    WhetherTag,
    RoleEditor
    // RoleDialog,
    // MenuDialog
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
      this.$refs.roleEditor.initData(Object.assign({}, row))
      this.formStatus.role.operationType = false
      this.formStatus.role.visible = true
    },
    handlerRowAdd () {
      const role = {
        id: '',
        roleName: '',
        accessLevel: 0,
        allowWorkorder: false,
        comment: ''
      }
      this.$refs.roleEditor.initData(role)
      this.formStatus.role.operationType = true
      this.formStatus.role.visible = true
    },
    handlerRowDel (row) {
      DELETE_ROLE_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功！')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        roleName: this.queryParam.roleName,
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
