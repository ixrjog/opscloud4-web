<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-input v-model="queryParam.name" size="mini" placeholder="名称"/>
      <el-select v-model.trim="queryParam.workOrderGroupId" size="mini" filterable clearable
                 remote reserve-keyword placeholder="搜索工单组" :remote-method="getGroup" @clear="fetchData">
        <el-option v-for="item in workOrderGroupOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"/>
      </el-select>
      <el-button @click="fetchData" size="mini">查询</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="seq" label="顺序" width="80"/>
      <el-table-column prop="workOrderGroup" label="群组">
        <template v-slot="scope">
          <span>{{ scope.row.workOrderGroup.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template v-slot="scope">
          <i :class="scope.row.icon"/>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类目颜色" width="100">
        <template v-slot="scope">
          <el-color-picker v-model="scope.row.color"/>
        </template>
      </el-table-column>
      <el-table-column prop="workOrderKey" label="Key">
        <template v-slot="scope">
          <el-tag size="mini">{{ scope.row.workOrderKey }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template v-slot="scope">
          <el-tag size="mini" :type="scope.row.status | toStatusColor">{{ scope.row.status | toStatusDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"/>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <work-order-editor ref="workOrderEditor" :formStatus="formStatus" @close="fetchData"/>
  </div>
</template>

<script>

import Pagination from '../common/page/Pagination'
import { QUERY_WORK_ORDER_PAGE } from '@/api/modules/workorder/workorder.api'
import { QUERY_WORK_ORDER_GROUP_PAGE } from '@/api/modules/workorder/workorder.group.api'
import { toStatusColor, toStatusDesc } from '@/filters/workorder'
import WorkOrderEditor from '@/components/opscloud/workorder/WorkOrderEditor'

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
        operationType: true,
        visible: false,
        addTitle: '新增工单配置',
        updateTitle: '更新工单配置'
      },
      options: {
        stripe: true
      },
      queryParam: {
        name: '',
        workOrderGroupId: '',
        extend: true
      },
      workOrderGroupOptions: []
    }
  },
  mounted () {
  },
  computed: {},
  components: {
    WorkOrderEditor,
    Pagination
  },
  filters: {
    toStatusDesc,
    toStatusColor
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
    getGroup (name) {
      const requestBody = {
        name: name,
        extend: false,
        page: 1,
        length: 10
      }
      QUERY_WORK_ORDER_GROUP_PAGE(requestBody)
        .then(res => {
          this.workOrderGroupOptions = res.body.data
        })
    },
    handleRowUpdate (row) {
      this.formStatus.operationType = false
      this.formStatus.visible = true
      this.$refs.workOrderEditor.initData(Object.assign({}, row))
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
