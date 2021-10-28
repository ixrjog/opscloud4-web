<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.name" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handlerAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="id" label="类型ID"></el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.color }">{{scope.row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serverGroupSize" label="服务器组数量"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <server-group-type-editor :formStatus="formStatus.groupType" ref="serverGroupTypeEditor"
                              @close="fetchData"></server-group-type-editor>
  </div>
</template>

<script>

// API
import {
  QUERY_SERVER_GROUP_TYPE_PAGE,
  DELETE_SERVER_GROUP_TYPE_BY_ID
} from '@/api/modules/server/server.group.type.api.js'
import Pagination from '../common/page/Pagination'

import ServerGroupTypeEditor from './ServerGroupTypeEditor'

export default {
  name: 'ServerGroupTypeTable',
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
        groupType: {
          visible: false,
          addTitle: '新增服务器组类型配置',
          updateTitle: '更新服务器组类型配置',
          labelWidth: '100px',
          operationType: true
        }
      },
      options: {
        stripe: true
      },
      queryParam: {
        name: '',
        extend: true
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    ServerGroupTypeEditor,
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
        DELETE_SERVER_GROUP_TYPE_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handlerAdd () {
      const serverGroupType = {
        id: '',
        name: '',
        color: '#dd4d3a',
        comment: ''
      }
      this.$refs.serverGroupTypeEditor.initData(serverGroupType)
      this.formStatus.groupType.operationType = true
      this.formStatus.groupType.visible = true
    },
    handlerRowUpdate (row) {
      this.$refs.serverGroupTypeEditor.initData(Object.assign({}, row))
      this.formStatus.groupType.operationType = false
      this.formStatus.groupType.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SERVER_GROUP_TYPE_PAGE(requestBody)
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
