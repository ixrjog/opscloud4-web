<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row :gutter="24" style="margin-left: 0">
      <el-input v-model="queryParam.resourceName" @change="fetchData" placeholder="资源名称"/>
      <el-select v-model="queryParam.groupId" filterable clearable @change="fetchData"
                 remote reserve-keyword placeholder="输入关键词搜索资源组" :remote-method="getGroup"
                 style="margin-left: 5px">
        <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id">
          <select-item :name="item.groupName" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.needAuth" clearable placeholder="鉴权" style="margin-left: 5px">
        <el-option v-for="item in authOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handleRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" v-loading="table.loading" style="width: 100%">
      <el-table-column prop="resourceName" label="资源" width="400"/>
      <el-table-column prop="comment" label="描述"/>
      <el-table-column prop="groupName" label="资源组">
        <template v-slot="scope">
          <span>{{ scope.row.group.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="needAuth" label="鉴权" width="150">
        <template v-slot="scope">
          <whether-tag :whether="scope.row.needAuth"/>
        </template>
      </el-table-column>
      <el-table-column prop="ui" label="用户界面" width="150">
        <template v-slot="scope">
          <whether-tag :whether="scope.row.ui"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <resource-editor ref="resourceEditor" :formStatus="formStatus.resource" :auth-options="authOptions"
                     :ui-options="uiOptions"
                     @close="fetchData"/>
  </div>
</template>

<script>

import { QUERY_RESOURCE_PAGE, DELETE_RESOURCE_BY_ID } from '@/api/modules/auth/auth.resource.api.js'
import { QUERY_GROUP_PAGE } from '@/api/modules/auth/auth.group.api.js'

import WhetherTag from '../common/tag/WhetherTag'
import SelectItem from '../common/SelectItem'
import ResourceEditor from './ResourceEditor'
import Pagination from '../common/page/Pagination'

const whetherOptions = [
  {
    value: false,
    label: '否'
  }, {
    value: true,
    label: '是'
  }]

export default {
  name: 'ResourceTable',
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
        resourceName: '',
        groupId: '',
        needAuth: ''
      },
      formStatus: {
        resource: {
          visible: false,
          operationType: true,
          addTitle: '新增资源配置',
          updateTitle: '更新资源配置'
        }
      },
      authOptions: whetherOptions,
      uiOptions: whetherOptions,
      groupOptions: []
    }
  },
  computed: {},
  mounted () {
    this.getGroup('')
    this.fetchData()
  },
  components: {
    Pagination,
    ResourceEditor,
    WhetherTag,
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
    getGroup (groupName) {
      const requestBody = {
        groupName: groupName,
        page: 1,
        length: 10
      }
      QUERY_GROUP_PAGE(requestBody)
        .then(res => {
          this.groupOptions = res.body.data
        })
    },
    handleRowEdit (row) {
      this.$refs.resourceEditor.initData(Object.assign({}, row))
      this.formStatus.resource.operationType = false
      this.formStatus.resource.visible = true
    },
    handleRowAdd () {
      const group = this.queryParam.groupId === '' ? null : this.groupOptions.find(e => e.id === this.queryParam.groupId)
      const resource = {
        id: '',
        groupId: group === null ? '' : group.id,
        group: group,
        resourceName: group !== null && group.basePath !== null ? group.basePath : '',
        comment: '',
        needAuth: true,
        ui: false
      }
      this.$refs.resourceEditor.initData(resource)

      this.formStatus.resource.operationType = true
      this.formStatus.resource.visible = true
    },
    handleRowDel (row) {
      DELETE_RESOURCE_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功！')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_RESOURCE_PAGE(requestBody)
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

</style>
