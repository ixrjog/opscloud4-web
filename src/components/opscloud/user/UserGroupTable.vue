<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新建</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称" width="200"></el-table-column>
      <el-table-column prop="allowOrder" label="工单申请" width="200">
        <template slot-scope="scope">
          <allow-tag :allow="scope.row.allowOrder"></allow-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userSize" label="成员数量" width="120"></el-table-column>
      <el-table-column prop="users" label="授权用户">
        <template slot-scope="scope">
          <users-tag :users="scope.row.users"></users-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述" width="300"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" :disabled="scope.row.userSize !== 0"
                     @click="handleRowDel(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <user-group-editor :formStatus="formStatus.userGroup" ref="userGroupEditor" @close="fetchData"></user-group-editor>
  </div>
</template>

<script>

import { QUERY_USER_GROUP_PAGE, DELETE_USERGROUP_BY_ID } from '@/api/modules/user/user.group.api.js'
import Pagination from '../common/page/Pagination'
import UsersTag from '../common/tag/UsersTag'
import UserGroupEditor from './UserGroupEditor'
import AllowTag from '@/components/opscloud/common/tag/AllowTag'

export default {
  name: 'UserGroupTable',
  data () {
    return {
      formStatus: {
        userGroup: {
          visible: false,
          operationType: true,
          addTitle: '新增用户组信息',
          updateTitle: '更新用户组信息'
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
        extend: true
      }
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    UserGroupEditor,
    AllowTag,
    UsersTag,
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
    handleRowUpdate (row) {
      this.formStatus.userGroup.operationType = false
      this.formStatus.userGroup.visible = true
      const userGroup = Object.assign({}, row)
      this.$refs.userGroupEditor.initData(userGroup)
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_USERGROUP_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleAdd () {
      this.formStatus.userGroup.visible = true
      this.formStatus.userGroup.operationType = true
      const userGroup = {
        id: '',
        name: '',
        groupType: 0,
        source: '',
        allowOrder: false,
        comment: ''
      }
      this.$refs.userGroupEditor.initData(userGroup)
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_USER_GROUP_PAGE(requestBody)
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
