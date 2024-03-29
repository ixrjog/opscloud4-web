<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="$t('leo.deploy.deployHistory')" :visible.sync="formStatus.visible" width="1100px">
    <el-row>
      <el-input v-model="queryParam.queryName" size="mini" :placeholder="$t('common.search.search')" @change="fetchData"/>
      <el-select v-model="queryParam.deployResult" size="mini" clearable :placeholder="$t('leo.deploy.deployResult')" @change="fetchData">
        <el-option v-for="item in deployResultOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-select v-model="queryParam.isActive" size="mini" clearable :placeholder="$t('common.active')" @change="fetchData">
        <el-option v-for="item in activeOptions"
                   :key="item.value"
                   :label="$t(item.label)"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" size="mini" class="button"><i class="fas fa-circle-notch"/></el-button>
    </el-row>
    <div style="height: 5px"/>
    <pagination v-show="table.pagination.total !==0" :pagination="table.pagination"
                @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <div style="height: 5px"/>
    <div v-for="deploy in table.data" :key="deploy.id" style="font-size: 12px">
      <template>
        <div>
          <leo-deploy-details :deploy="deploy" :ref="`leoDeployDetails_${deploy.id}`"/>
        </div>
      </template>
    </div>
    <div style="height: 5px"/>
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
  label: 'common.activeOptions.active'
}, {
  value: false,
  label: 'common.activeOptions.inactive'
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
