<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model="queryParam.name" placeholder="名称"/>
      <el-select v-model.trim="queryParam.serverGroupTypeId" filterable clearable
                 remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getGroupType">
        <el-option
          v-for="item in groupTypeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="serverGroupType" label="组类型">
        <template slot-scope="scope">
          <el-tag size="mini" disable-transitions :style="{ color: scope.row.serverGroupType.color }">
            {{ scope.row.serverGroupType.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="allowOrder" label="工单申请" width="200">
        <template slot-scope="scope">
          <allow-tag :allow="scope.row.allowOrder"></allow-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serverSize" label="服务器数量"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" :disabled="scope.row.serverSize !== 0"
                     @click="handleRowDel(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <server-group-editor :formStatus="formStatus.serverGroup" ref="serverGroupEditor"
                         @close="fetchData"></server-group-editor>
  </div>
</template>

<script>

// API
import { QUERY_SERVER_GROUP_TYPE_PAGE } from '@/api/modules/server/server.group.type.api.js'
import { QUERY_SERVER_GROUP_PAGE, DELETE_SERVER_GROUP_BY_ID } from '@/api/modules/server/server.group.api.js'

import Pagination from '../common/page/Pagination'
import ServerGroupEditor from './ServerGroupEditor'
import AllowTag from '@/components/opscloud/common/tag/AllowTag'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'

export default {
  name: 'ServerGroupTable',
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
    ServerGroupEditor,
    AllowTag,
    Pagination,
    SelectItem
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
    tableRowClassName ({ row, rowIndex }) {
      if (!row.allowOrder) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    getGroupType (name) {
      const requestBody = {
        name: name,
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_TYPE_PAGE(requestBody)
        .then(res => {
          this.groupTypeOptions = res.body.data
        })
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_SERVER_GROUP_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
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
      this.$refs.serverGroupEditor.initData(serverGroup)
      this.formStatus.serverGroup.operationType = true
      this.formStatus.serverGroup.visible = true
    },
    handleRowUpdate (row) {
      this.$refs.serverGroupEditor.initData(Object.assign({}, row))
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
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style>

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

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
