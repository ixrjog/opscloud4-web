<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="leoJob.name" :visible.sync="formStatus.visible" width="90%">
    <el-row>
      <el-input v-model="queryParam.queryName" size="mini" :placeholder="$t('common.search.search')" @change="fetchData"/>
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
    <div v-for="build in table.data" :key="build.id" style="font-size: 12px">
      <template>
        <div>
          <leo-build-details :build="build" :ref="`leoBuildDetails_${build.id}`"/>
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
import { QUERY_LEO_JOB_BUILD_PAGE } from '@/api/modules/leo/leo.job.api'
import Pagination from '@/components/opscloud/common/page/Pagination'
import LeoBuildDetails from '@/components/opscloud/leo/LeoBuildDetails'

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

export default {
  name: 'LeoBuildHistory',
  props: ['formStatus'],
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
      leoJob: {},
      queryParam: {
        queryName: '',
        isActive: true
      },
      activeOptions: activeOptions,
      options: options
    }
  },
  components: {
    Pagination,
    LeoBuildDetails
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
    initData (leoBuild) {
      this.leoJob = leoBuild
      this.fetchData()
    },
    fetchData () {
      const requestBody = {
        ...this.queryParam,
        jobId: this.leoJob.id,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_JOB_BUILD_PAGE(requestBody)
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
