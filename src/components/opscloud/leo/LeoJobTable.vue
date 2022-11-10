<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字查询" @change="fetchData"/>
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
      <el-select v-model.trim="queryParam.templateId" filterable clearable
                 remote reserve-keyword placeholder="搜索并选择模板" :remote-method="getTemplate"
                 @change="fetchData">
        <el-option
          v-for="item in templateOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.envType" clearable filterable
                 remote reserve-keyword placeholder="输入关键词搜索环境" :remote-method="getEnv" @change="fetchData">
        <el-option
          v-for="item in envOptions"
          :key="item.id"
          :label="item.envName"
          :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
        <el-option
          v-for="item in activeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="queryParam.tagId" filterable clearable remote reserve-keyword
        placeholder="请输入关键词搜索标签" :remote-method="getTag" @change="fetchData">
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
      <el-table-column prop="name" label="名称" sortable></el-table-column>
      <el-table-column prop="application" label="应用">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light"
                      :content="scope.row.application.comment === '' ? '未定义': scope.row.application.comment"
                      placement="top-start">
            <el-tag size="mini">{{ scope.row.application.name }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="template" label="模板">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light"
                      :content="scope.row.template.comment === '' ? '未定义': scope.row.template.comment"
                      placement="top-start">
            <span>{{ scope.row.template.name }}</span>
          </el-tooltip>
          <el-tag size="mini" style="margin-left: 5px" :type="scope.row.verifyTemplateVersion.type">
            {{ scope.row.verifyTemplateVersion.displayVersion }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="branch" label="首选分支" sortable></el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="80">
        <template slot-scope="scope">
          <active-tag :is-active="scope.row.isActive"></active-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template slot-scope="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleBuild(scope.row)">构建</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <leo-job-editor :formStatus="formStatus.job" ref="jobEditor"
                    @close="fetchData"></leo-job-editor>
    <leo-build-editor :form-status="formStatus.build" ref="buildEditor">
    </leo-build-editor>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"></business-tag-editor>
  </div>
</template>

<script>

import { QUERY_LEO_JOB_PAGE } from '@/api/modules/leo/leo.job.api'
import { QUERY_APPLICATION_KUBERNETES_PAGE } from '@/api/modules/application/application.api'
import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'

import SelectItem from '../common/SelectItem'
import ActiveTag from '../common/tag/ActiveTag'
import BusinessTags from '../common/tag/BusinessTags'
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import Pagination from '../common/page/Pagination'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'
import { QUERY_LEO_TEMPLATE_PAGE } from '@/api/modules/leo/leo.template.api'
import LeoJobEditor from '@/components/opscloud/leo/LeoJobEditor'
import LeoBuildEditor from '@/components/opscloud/leo/LeoBuildEditor'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'leoJobTable',
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
          title: '编辑Leo任务标签'
        },
        job: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增任务配置',
          updateTitle: '更新任务配置'
        },
        build: {
          visible: false,
          labelWidth: '150px'
        }
      },
      queryParam: {
        queryName: '',
        applicationId: '',
        templateId: '',
        envType: '',
        tagId: '',
        isActive: '',
        extend: true
      },
      tagOptions: [],
      businessType: BusinessType.LEO_JOB,
      applicationOptions: [],
      templateOptions: [],
      envOptions: [],
      activeOptions: activeOptions
    }
  },
  mounted () {
    this.fetchData()
    this.getApplication('')
    this.getTemplate('')
    this.getTag('')
    this.getEnv()
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    ActiveTag,
    EnvTag,
    BusinessTagEditor,
    LeoJobEditor,
    LeoBuildEditor
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
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    getTag (name) {
      const requestBody = {
        tagKey: name,
        businessType: this.businessType,
        append: true,
        page: 1,
        length: 20
      }
      QUERY_TAG_PAGE(requestBody)
        .then(res => {
          this.tagOptions = res.body.data
        })
    },
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_APPLICATION_KUBERNETES_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
    },
    getTemplate (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_LEO_TEMPLATE_PAGE(requestBody)
        .then(res => {
          this.templateOptions = res.body.data
        })
    },
    handleRowTagEdit (row) {
      this.instance.id = row.id
      const businessTags = {
        tagIds: row.tags !== null ? row.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
    },
    handleRowEdit (row) {
      this.formStatus.job.visible = true
      this.formStatus.job.operationType = false
      this.$refs.jobEditor.initData(Object.assign({}, row))
    },
    handleRowDel (row) {

    },
    handleBuild (row) {
      this.formStatus.build.visible = true
      this.$refs.buildEditor.initData(Object.assign({}, row))
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_JOB_PAGE(requestBody)
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
