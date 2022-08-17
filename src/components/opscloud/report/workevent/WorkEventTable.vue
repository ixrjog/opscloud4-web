<template>
  <div>
    <el-row>
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询" class="input"/>
      <el-select v-model="queryParam.workRoleId" placeholder="选择角色" class="select" clearable @change="workRoleChange">
        <el-option
          v-for="item in workRoleOptions"
          :key="item.id"
          :label="item.workRoleName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-cascader :options="workItemOptions" :props="workItemProps" clearable
                   @change="handleChange" class="cascader" placeholder="选择类目" collapse-tags>
      </el-cascader>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleAdd" class="button">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column label="角色" width="150">
        <template slot-scope="props">
          <span>{{ props.row.workRole.workRoleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" width="150" show-overflow-tooltip>
        <template slot-scope="props">
          <span>{{ props.row.workItem.workItemName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="weeks" label="时间" width="100"></el-table-column>
      <el-table-column prop="workEventCnt" label="次数" width="60"></el-table-column>
      <el-table-column label="用户" width="200">
        <template slot-scope="props">
          <user-tag :user="props.row.user"></user-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="说明"></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <!--          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>-->
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <work-event-editor ref="workEventEditor" :form-status="formStatus.workEvent" @closeDialog="dataChange"
                       :work-role-options="workRoleOptions"></work-event-editor>
  </div>
</template>

<script>
import {
  DELETE_WORK_EVENT,
  QUERY_WORK_EVENT_PAGE,
  QUERY_WORK_ITEM_TREE,
  QUERY_WORK_ROLE
} from '@/api/modules/report/workevent/work.event.api'
import Pagination from '@/components/opscloud/common/page/Pagination'
import UserTag from '@/components/opscloud/common/tag/UserTag'
import WorkEventEditor from '@/components/opscloud/report/workevent/WorkEventEditor'

export default {
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
      loading: false,
      workRoleOptions: [],
      workItemOptions: [],
      workItemProps: {
        multiple: true,
        expandTrigger: 'hover',
        emitPath: false
      },
      queryParam: {
        queryName: '',
        workRoleId: '',
        workItemIdList: []
      },
      formStatus: {
        workEvent: {
          visible: false
        }
      }
    }
  },
  name: 'WorkEventTable',
  mounted () {
    this.getWorkRole()
    this.getWorkItemTree()
    this.fetchData()
  },
  components: {
    UserTag,
    Pagination,
    WorkEventEditor
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
    handleChange (value) {
      this.queryParam.workItemIdList = []
      value.map(workItemId => {
        this.queryParam.workItemIdList.push(workItemId)
      })
    },
    workRoleChange () {
      this.getWorkItemTree()
    },
    getWorkRole () {
      this.workRoleOptions = []
      QUERY_WORK_ROLE().then(({ body }) => {
        this.workRoleOptions = body
      })
    },
    getWorkItemTree () {
      this.workItemOptions = []
      const requestBody = {
        workRoleId: this.queryParam.workRoleId === '' ? -1 : this.queryParam.workRoleId
      }
      QUERY_WORK_ITEM_TREE(requestBody).then(({ body }) => {
        this.workItemOptions = body
      })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      if (requestBody.workRoleId === '') {
        requestBody.workRoleId = -1
      }
      QUERY_WORK_EVENT_PAGE(requestBody).then(({ body }) => {
        this.table.data = body.data
        this.table.loading = false
        this.table.pagination.total = body.totalNum
      })
    },
    handleAdd () {
      this.formStatus.workEvent.visible = true
      this.$refs.workEventEditor.initData()
    },
    dataChange () {
      this.fetchData()
      this.$emit('refreshData')
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_WORK_EVENT({ id: row.id }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    }
  }
}
</script>

<style scoped>
.input {
  display: inline-block;
  max-width: 200px;
}

.select, .button {
  margin-left: 5px;
}

.cascader {
  margin-left: 5px;
  width: 400px;
}

</style>
