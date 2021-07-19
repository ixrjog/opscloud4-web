<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字查询"/>
      <el-select v-model.trim="queryParam.serverGroupId" filterable clearable
                 remote reserve-keyword placeholder="搜索服务器组" :remote-method="getGroup">
        <el-option
          v-for="item in serverGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParam.envType" clearable filterable
                 remote reserve-keyword placeholder="输入关键词搜索环境" :remote-method="getEnv">
        <el-option
          v-for="item in envOptions"
          :key="item.id"
          :label="item.envName"
          :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select
        v-model="queryParam.tagId" filterable clearable remote reserve-keyword
        placeholder="请输入关键词搜索标签" :remote-method="getTag">
        <el-option
          v-for="item in tagOptions"
          :key="item.id"
          :label="item.tagKey"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称" width="200"></el-table-column>
      <el-table-column prop="serialNumber" label="序号" width="80" sortable></el-table-column>
      <el-table-column prop="publicIp" label="公网ip" width="120"></el-table-column>
      <el-table-column prop="privateIp" label="私网ip" width="120"></el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签">
        <template slot-scope="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="授权账户">
        <template slot-scope="scope">
          <server-accounts-button :server="scope.row" @handleRemote="handleRemote"></server-accounts-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { QUERY_USER_REMOTE_SERVER } from '@/api/modules/user/user.server.api.js'

import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api.js'
import SelectItem from '../common/SelectItem'
import EnvTag from '../common/tag/EnvTag'
import BusinessTags from '../common/tag/BusinessTags'

import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import ServerAccountsButton from '../common/button/ServerAccountsButton'

export default {
  name: 'RemoteServerSelector',
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
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑数据源实例标签'
        },
        server: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增服务器配置',
          updateTitle: '更新服务器配置'
        }
      },
      queryParam: {
        queryName: '',
        serverGroupId: '',
        envType: '',
        tagId: '',
        isActive: '',
        serverStatus: '',
        extend: true
      },
      tagOptions: [],
      envOptions: [],
      serverGroupOptions: [],
      businessType: BusinessType.SERVER
    }
  },
  mounted () {
    this.fetchData()
    this.getEnv('')
    this.getTag('')
    this.getGroup('')
  },
  computed: {},
  components: {
    SelectItem,
    BusinessTags,
    EnvTag,
    ServerAccountsButton
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
    getTag (name) {
      const requestBody = {
        tagKey: name,
        businessType: this.businessType,
        page: 1,
        length: 20
      }
      QUERY_TAG_PAGE(requestBody)
        .then(res => {
          this.tagOptions = res.body.data
        })
    },
    getEnv (name) {
      const requestBody = {
        envName: name,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    getGroup (name) {
      const requestBody = {
        name: name,
        serverGroupTypeId: '',
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.serverGroupOptions = res.body.data
        })
    },
    handleRemote (remoteServer) {
      this.$emit('handleRemote', remoteServer)
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_USER_REMOTE_SERVER(requestBody)
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
