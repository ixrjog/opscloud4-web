<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model="queryParam.applicationName" filterable clearable size="mini"
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="fetchData">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.name">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <span style="margin-left: 5px"/>
      <el-radio-group v-model="queryParam.envName" size="mini" @change="fetchData">
        <el-radio-button v-for="env in envOptions" :label="env.envName" :key="env.envName">
          {{ env.envName }}
        </el-radio-button>
      </el-radio-group>
      <span style="margin-left: 5px"/>
      <el-checkbox v-model="queryParam.isGray" @change="fetchData">
        <span>Gray Release</span>
      </el-checkbox>
      <span style="margin-left: 5px"/>
      <el-button @click="fetchData" size="mini" class="button">查询</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="应用名称"/>
      <el-table-column prop="assetKey" label="环境" width="80"/>
      <el-table-column prop="properties" label="变更拦截" width="80">
        <template v-slot="scope">
          <el-tag size="mini" :type="scope.row.properties.success === 'true' ? 'success' : 'danger'">
            {{ scope.row.properties.success === 'true' ? '放行' : '拦截' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="properties" label="灰度发布" width="80">
        <template v-slot="scope">
          <el-tag size="mini" :type="scope.row.properties.isGray === 'true' ? 'success' : 'danger'">
            {{ scope.row.properties.isGray === 'true' ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="properties" label="灰度分支">
        <template v-slot="scope">
          {{ scope.row.properties.isGray === 'true' ? scope.row.properties.branchName : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="properties" label="工单ID" width="80">
        <template v-slot="scope">{{ scope.row.properties.ticketId }}</template>
      </el-table-column>
      <el-table-column label="返回信息" show-overflow-tooltip>
        <template v-slot="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="操作时间">
        <template v-slot="scope">{{ scope.row.createdTime }}</template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
  </div>
</template>

<script>

import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import { QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { QUERY_APOLLO_RELEASE_ASSET_PAGE } from '@/api/modules/datasource/datasource.asset.custom.api'

import Pagination from '@/components/opscloud/common/page/Pagination.vue'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'apollo-release-table',
  props: ['instanceId'],
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
      queryParam: {
        applicationName: '',
        envName: 'prod',
        tagId: '',
        isActive: '',
        isGray: false,
        extend: true
      },
      envOptions: [],
      applicationOptions: [],
      activeOptions: activeOptions
    }
  },
  mounted () {
    this.fetchData()
    this.getEnv('')
  },
  computed: {},
  components: {
    SelectItem,
    Pagination
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
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 10
      }
      QUERY_APPLICATION_PAGE(requestBody)
        .then(({ body }) => {
          this.applicationOptions = body.data
        })
    },
    getEnv (name) {
      const requestBody = {
        envName: name,
        isActive: true,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        instanceId: this.instanceId,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_APOLLO_RELEASE_ASSET_PAGE(requestBody)
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
