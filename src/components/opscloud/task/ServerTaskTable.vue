<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.finalized" clearable placeholder="完成">
        <el-option
          v-for="item in taskEndOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="taskUuid" label="任务 UUID" width="150"></el-table-column>
      <el-table-column prop="username" label="执行用户" width="80"></el-table-column>
      <el-table-column prop="taskName" label="任务名称" width="100" sortable></el-table-column>
      <el-table-column prop="memberSize" label="服务器数量" width="80"></el-table-column>
      <el-table-column prop="finalized" label="任务状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.finalized ? 'success' : 'warning'">
            <i class="el-icon-loading" v-show="!scope.row.finalized"/>
            {{ scope.row.finalized ? '完成': '执行中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="任务开始时间<以前>" width="120">
        <template slot-scope="scope">
          {{scope.row.startTime}} <{{scope.row.ago}}>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="任务结束时间<时长>" width="120">
        <template slot-scope="scope" v-if="scope.row.endTime !== null">
          {{scope.row.endTime}} <{{scope.row.duration}}>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <!--        <template slot-scope="scope">-->
        <!--          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>-->
        <!--          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>-->
        <!--          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>-->
        <!--        </template>-->
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import { QUERY_SERVER_TASK_PAGE } from '@/api/modules/task/server.task.api.js'
import EnvTag from '../common/tag/EnvTag'
import Pagination from '../common/page/Pagination'


const taskEndOptions = [{
  value: true,
  label: '是'
}, {
  value: false,
  label: '否'
}]

export default {
  data () {
    return {
      instance: {
        id: ''
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
      formStatus: {},
      queryParam: {
        queryName: '',
        finalized: '',
        extend: true
      },
      taskEndOptions: taskEndOptions
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    Pagination,
    EnvTag
  },
  filters: {},
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SERVER_TASK_PAGE(requestBody)
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
