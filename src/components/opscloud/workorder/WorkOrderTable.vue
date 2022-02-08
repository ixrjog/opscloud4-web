<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.name" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="workOrderKey" label="KEY"></el-table-column>
      <el-table-column prop="seq" label="顺序" width="80"></el-table-column>
      <el-table-column prop="status" label="状态" width="100"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>


import Pagination from '../common/page/Pagination'
import AllowTag from '@/components/opscloud/common/tag/AllowTag'
import { QUERY_WORK_ORDER_PAGE } from '@/api/modules/workorder/workorder.api'

export default {
  name: 'WorkOrderTable',
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
        serverGroup: {
          operationType: true,
          visible: false,
          addTitle: '新增服务器组配置',
          updateTitle: '更新服务器组配置'
        }
      },
      options: {
        stripe: true
      },
      queryParam: {
        name: '',
        serverGroupTypeId: '',
        extend: true
      },
      groupTypeOptions: []
    }
  },
  mounted () {
    this.getGroupType('')
    this.fetchData()
  },
  computed: {},
  components: {
    AllowTag,
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
    // handleRowDel (row) {
    //   this.$confirm('此操作将删除当前配置?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     DELETE_SERVER_GROUP_BY_ID(row.id).then(res => {
    //       this.$message.success('删除成功!')
    //       this.fetchData()
    //     })
    //   }).catch(() => {
    //     this.$message.info('已取消删除!')
    //   })
    // },
    handleAdd () {
      const serverGroup = {
        id: '',
        name: 'group_',
        allowOrder: true,
        serverGroupTypeId: '',
        serverGroupType: {},
        businessProperty: null,
        comment: ''
      }
      //this.$refs.serverGroupEditor.initData(serverGroup)
      this.formStatus.serverGroup.operationType = true
      this.formStatus.serverGroup.visible = true
    },
    handleRowUpdate (row) {
      // this.$refs.serverGroupEditor.initData(Object.assign({}, row))
      this.formStatus.serverGroup.operationType = false
      this.formStatus.serverGroup.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_WORK_ORDER_PAGE(requestBody)
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

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>

