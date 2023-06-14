<!--suppress HtmlUnknownTag -->
<template>
  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{ bind ? '绑定资源' : '未绑定资源' }}</span>
    </div>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="resourceName" label="资源路径"/>
      <el-table-column prop="comment" label="描述"/>
      <el-table-column fixed="right" label="操作" width="280">
        <template v-slot="scope">
          <el-button type="success" plain size="mini" @click="handleRowBind(scope.row)" v-if="!bind">绑定</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowUnbind(scope.row)" v-if="bind">解除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
  </el-card>
</template>

<script>
import {
  QUERY_BIND_ROLE_RESOURCE_PAGE,
  ADD_ROLE_RESOURCE,
  DELETE_ROLE_RESOURCE_BY_ID
} from '@/api/modules/auth/auth.role.resource.api.js'
import Pagination from '../common/page/Pagination'

export default {
  name: 'RoleResourceTable',
  props: ['roleId', 'groupId', 'bind'],
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
      }
    }
  },
  components: {
    Pagination
  },
  computed: {},
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    handleRowBind (row) {
      const requestBody = {
        resourceId: row.id,
        roleId: this.roleId
      }
      ADD_ROLE_RESOURCE(requestBody)
        .then(res => {
          this.$emit('fetchData')
        })
    },
    handleRowUnbind (row) {
      DELETE_ROLE_RESOURCE_BY_ID(row.id)
        .then(res => {
          this.$emit('fetchData')
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        roleId: this.roleId,
        groupId: this.groupId,
        bind: this.bind,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_BIND_ROLE_RESOURCE_PAGE(requestBody)
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

  >>> .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    //-webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
