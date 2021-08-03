<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询"/>
      <el-button @click="fetchData">查询</el-button>
      <!--        <el-button @click="syncLdapUser" style="margin-left: 5px">同步</el-button>-->
      <el-button @click="handlerAdd">新建</el-button>
      <!--        <el-button @click="handlerRevokeToken" style="margin-left: 5px">吊销令牌</el-button>-->
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="displayName" label="显示名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作" width="380">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowUpdate(scope.row)">编辑</el-button>
          <!--          <el-tooltip class="item" effect="light" content="用户组授权" placement="top-start">-->
          <!--            <el-button type="primary" plain size="mini" icon="el-icon-user-solid" @click="editUserGroup(scope.row)">-->
          <!--              授权-->
          <!--            </el-button>-->
          <!--          </el-tooltip>-->
          <!--          <el-tooltip class="item" effect="light" content="服务器组授权" placement="top-start">-->
          <!--            <el-button type="primary" plain size="mini" icon="fa fa-server" @click="editServerGroup(scope.row)">授权-->
          <!--            </el-button>-->
          <!--          </el-tooltip>-->
          <!--          <el-button type="danger" plain size="mini" @click="retireUser(scope.row)">离职</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <user-editor :formStatus="formStatus.user" ref="userEditor" @close="fetchData"></user-editor>
  </div>
</template>

<script>

import { QUERY_USER_PAGE } from '@/api/modules/user/user.api.js'
import Pagination from '../common/page/Pagination'
import UserEditor from './UserEditor'

export default {
  name: 'UserTable',
  data () {
    return {
      formStatus: {
        user: {
          visible: false,
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        },
        group: {
          visible: false,
          title: '用户授权'
        }
      },
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
    this.fetchData()
  },
  components: {
    UserEditor,
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
    handlerRowUpdate (row) {
      this.formStatus.user.operationType = false
      this.formStatus.user.visible = true
      const user = Object.assign({}, row)
      this.$refs.userEditor.initData(user)
    },
    handlerAdd () {
      this.formStatus.user.visible = true
      this.formStatus.user.operationType = true
      const user = {
        id: '',
        username: '',
        password: '',
        name: '',
        displayName: '',
        isActive: true,
        wechat: '',
        email: '',
        phone: '',
        comment: ''
      }
      this.$refs.userEditor.initData(user)
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

  .el-input {
    display: inline-block;
    max-width: 200px;
  }

  .el-button {
    margin-left: 5px;
  }
</style>
