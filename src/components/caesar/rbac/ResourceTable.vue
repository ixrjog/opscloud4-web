<template>
  <div>
    <el-row :gutter="24" style="margin-left: 0px;">
      <el-input v-model="queryParam.resourceName" placeholder="资源名称"/>
      <el-select v-model="queryParam.groupId" filterable clearable
                 remote reserve-keyword placeholder="输入关键词搜索资源组" :remote-method="getGroup"
                 style="margin-left: 5px">
        <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id">
          <select-item :name="item.groupName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.needAuth" clearable placeholder="鉴权" style="margin-left: 5px">
        <el-option
          v-for="item in authOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handlerRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="table.data" v-loading="table.loading" style="width: 100%">
      <el-table-column prop="resourceName" label="资源" width="400"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column prop="groupName" label="资源组">
        <template slot-scope="scope">
          <span>{{scope.row.group.groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="needAuth" label="鉴权" width="150">
        <template slot-scope="scope">
          <whether-tag :whether="scope.row.needAuth"></whether-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ui" label="用户界面" width="150">
        <template slot-scope="scope">
          <whether-tag :whether="scope.row.ui"></whether-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
          <!--                    <el-button type="primary" plain size="mini" @click="editMenu(scope.row)">菜单</el-button>-->
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="table.pagination.total"
                   :current-page="table.pagination.currentPage"
                   :page-size="table.pagination.pageSize">
    </el-pagination>
    <resource-editor ref="resourceEditor" :formStatus="formStatus.resource" :auth-options="authOptions" :ui-options="uiOptions"
                     @close="fetchData"></resource-editor>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { QUERY_RESOURCE_PAGE, DELETE_RESOURCE_BY_ID } from '@/api/modules/auth/auth.resource.api.js'
import { QUERY_GROUP_PAGE } from '@/api/modules/auth/auth.group.api.js'

import WhetherTag from '../common/tag/WhetherTag'
import SelectItem from '../common/SelectItem'
import ResourceEditor from './ResourceEditor'

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
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mounted () {
    this.initPageSize()
    this.getGroup('')
    this.fetchData()
  },
  components: {
    ResourceEditor,
    WhetherTag,
    SelectItem
  },
  methods: {
    ...mapActions({
      setPageSize: 'd2admin/user/set'
    }),
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.info.pageSize = size
      this.setPageSize(this.info)
      this.fetchData()
    },
    initPageSize () {
      if (typeof (this.info.pageSize) !== 'undefined') {
        this.table.pagination.pageSize = this.info.pageSize
      }
    },
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
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
    handlerRowEdit (row) {
      this.$refs.resourceEditor.initData(Object.assign({}, row))
      this.formStatus.resource.operationType = false
      this.formStatus.resource.visible = true
    },
    handlerRowAdd () {
      const resource = {
        id: '',
        groupId: '',
        group: null,
        resourceName: '',
        comment: '',
        needAuth: true,
        ui: false
      }
      this.$refs.resourceEditor.initData(resource)
      this.formStatus.resource.operationType = true
      this.formStatus.resource.visible = true
    },
    handlerRowDel (row) {
      DELETE_RESOURCE_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功！')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        resourceName: this.queryParam.resourceName,
        needAuth: this.queryParam.needAuth,
        groupId: this.queryParam.groupId,
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
