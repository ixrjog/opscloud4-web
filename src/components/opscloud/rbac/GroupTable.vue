<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0">
      <el-input v-model="queryParam.groupName" placeholder="资源组名称" style="display: inline-block; max-width:200px"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handlerRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="groupName" label="资源组名称"/>
      <el-table-column prop="basePath" label="基本路径"/>
      <el-table-column prop="resourceSize" label="资源数量"/>
      <el-table-column prop="comment" label="描述"/>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <group-editor ref="groupEditor" :formStatus="formStatus.group" @close="fetchData"/>
  </div>
</template>

<script>
// API
import { QUERY_GROUP_PAGE, DELETE_GROUP_BY_ID } from '@/api/modules/auth/auth.group.api.js'
import GroupEditor from './GroupEditor'
import Pagination from '../common/page/Pagination'

export default {
  name: 'AuthGroupTable',
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
        queryName: '',
        extend: true
      },
      formStatus: {
        group: {
          visible: false,
          addTitle: '新增资源组配置',
          updateTitle: '更新资源组配置',
          operationType: true
        }
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  components: {
    GroupEditor,
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
    handlerRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_GROUP_BY_ID(row.id).then(res => {
          this.fetchData()
          this.$message.success('删除成功!')
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handlerRowAdd () {
      const group = {
        id: '',
        groupName: '',
        comment: ''
      }
      this.$refs.groupEditor.initData(group)
      this.formStatus.group.operationType = true
      this.formStatus.group.visible = true
    },
    handlerRowEdit (row) {
      this.$refs.groupEditor.initData(Object.assign({}, row))
      this.formStatus.group.operationType = false
      this.formStatus.group.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_GROUP_PAGE(requestBody)
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

</style>
