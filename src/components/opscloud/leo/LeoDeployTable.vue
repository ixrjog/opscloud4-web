<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-select v-model.trim="queryParam.applicationId" filterable clearable
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="fetchData">
        <el-option
          v-for="item in applicationOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.envType" clearable filterable
                 remote reserve-keyword placeholder="输入关键词搜索环境" :remote-method="getEnv"
                 @change="fetchData">
        <el-option
          v-for="item in envOptions"
          :key="item.id"
          :label="item.envName"
          :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.deployResult" clearable filterable placeholder="选择部署结果"
                 @change="fetchData">
        <el-option
          v-for="item in deployResultOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">刷新</el-button>
    </el-row>
    <div v-for="deploy in table.data" :key="deploy.id" style="font-size: 12px">
      <template>
        <div>
          <leo-deploy-details :deploy="deploy" :ref="`leoDeployDetails_${deploy.id}`"></leo-deploy-details>
        </div>
      </template>
    </div>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import { QUERY_LEO_JOB_DEPLOY_PAGE } from '@/api/modules/leo/leo.job.api'
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'

import SelectItem from '../common/SelectItem'
import BusinessTags from '../common/tag/BusinessTags'
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import Pagination from '../common/page/Pagination'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'
import LeoJobEditor from '@/components/opscloud/leo/LeoJobEditor'
import LeoDoBuildEditor from '@/components/opscloud/leo/LeoDoBuildEditor'
import LeoDeployDetails from '@/components/opscloud/leo/LeoDeployDetails.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const deployResultOptions = [
  {
    value: 'SUCCESS',
    label: 'SUCCESS'
  },
  {
    value: 'ERROR',
    label: 'ERROR'
  }
]

export default {
  name: 'leoDeployTable',
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
        queryName: '',
        applicationId: '',
        deployResult: '',
        envType: ''
      },
      tagOptions: [],
      businessType: BusinessType.LEO_JOB,
      applicationOptions: [],
      envOptions: [],
      deployResultOptions: deployResultOptions,
      activeOptions: activeOptions
    }
  },
  mounted () {
    this.fetchData()
    this.getApplication('')
    this.getEnv()
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    EnvTag,
    BusinessTagEditor,
    LeoJobEditor,
    LeoDoBuildEditor,
    LeoDeployDetails
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
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
    },
    fetchData () {
      if (this.queryParam.applicationId === '') return
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_JOB_DEPLOY_PAGE(requestBody)
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
