<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.name" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="seq" label="顺序" width="80"></el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workOrderSize" label="工单数量"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" :disabled="scope.row.workOrderSize !== 0"
                     @click="handleRowDel(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <work-order-group-editor ref="workOrderGroupEditor" :formStatus="formStatus"
                             @close="fetchData"></work-order-group-editor>
  </div>
</template>

<script>

import Pagination from '../common/page/Pagination'
import { DELETE_WORK_ORDER_GROUP, QUERY_WORK_ORDER_GROUP_PAGE } from '@/api/modules/workorder/workorder.group.api'
import WorkOrderGroupEditor from '@/components/opscloud/workorder/WorkOrderGroupEditor'

export default {
  name: 'WorkOrderGroupTable',
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
        operationType: true,
        visible: false,
        addTitle: '新增工单群组配置',
        updateTitle: '更新工单群组配置'
      },
      options: {
        stripe: true
      },
      queryParam: {
        name: '',
        extend: true
      },
      groupTypeOptions: []
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    WorkOrderGroupEditor,
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
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_WORK_ORDER_GROUP({ workOrderGroupId: row.id }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleAdd () {
      const workOrderGroup = {
        name: '',
        groupType: 0,
        seq: '',
        icon: '',
        comment: ''
      }
      this.formStatus.operationType = true
      this.formStatus.visible = true
      this.$refs.workOrderGroupEditor.initData(workOrderGroup)
    },
    handleRowUpdate (row) {
      this.formStatus.operationType = false
      this.formStatus.visible = true
      this.$refs.workOrderGroupEditor.initData(Object.assign({}, row))
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_WORK_ORDER_GROUP_PAGE(requestBody).then(res => {
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
