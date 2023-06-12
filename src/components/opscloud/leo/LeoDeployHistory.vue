<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog title="部署历史" :visible.sync="formStatus.visible" width="75%">
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字查询" @change="fetchData"/>
      <el-select v-model="queryParam.deployResult" clearable placeholder="部署结果" @change="fetchData">
        <el-option v-for="item in deployResultOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
        <el-option v-for="item in activeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <pagination v-show="table.pagination.total !==0" :pagination="table.pagination"
                @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <div v-for="deploy in table.data" :key="deploy.id" style="font-size: 12px">
      <template>
        <div>
          <leo-deploy-details :deploy="deploy" :ref="`leoDeployDetails_${deploy.id}`"/>
        </div>
      </template>
    </div>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
  </el-dialog>
</template>

<script>

// API
import { QUERY_LEO_JOB_DEPLOY_PAGE } from '@/api/modules/leo/leo.job.api'
import Pagination from '@/components/opscloud/common/page/Pagination'
import LeoDeployDetails from '@/components/opscloud/leo/LeoDeployDetails.vue'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const deployResultOptions = [{
  value: 'SUCCESS',
  label: 'SUCCESS'
}, {
  value: 'ERROR',
  label: 'ERROR'
}]

export default {
  name: 'LeoDeployHistory',
  props: ['formStatus', 'applicationId', 'envType'],
  data () {
    return {
      table: {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      queryParam: {
        queryName: '',
        deployResult: '',
        isActive: true
      },
      activeOptions: activeOptions,
      deployResultOptions: deployResultOptions,
      options: options
    }
  },
  components: {
    Pagination,
    LeoDeployDetails
  },
  mixins: [],
  mounted () {
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      require('brace/ext/language_tools')
      // language
      require('brace/mode/yaml')
      require('brace/mode/xml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
      require('brace/snippets/xml')
    },
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    initData () {
      this.fetchData()
    },
    fetchData () {
      const requestBody = {
        ...this.queryParam,
        applicationId: this.applicationId,
        envType: this.envType,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_JOB_DEPLOY_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
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
