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
      <el-button @click="handleAdd" class="button">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="application" label="应用">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light"
                      :content="scope.row.application.comment === '' ? '未定义': scope.row.application.comment"
                      placement="top-start">
            <el-tag size="mini">{{ scope.row.application.name }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" sortable></el-table-column>
      <el-table-column prop="branch" label="首选分支" sortable>
        <template v-slot="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"></i>
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="template" label="模板">
        <template v-slot="scope">
          <el-tooltip class="item" effect="light"
                      :content="scope.row.template.comment === '' ? '未定义': scope.row.template.comment"
                      placement="top-start">
            <span>{{ scope.row.template.name }}</span>
          </el-tooltip>
          <el-tag size="mini" :type="scope.row.verifyTemplateVersion.type" style="margin-left: 5px">
            {{ scope.row.verifyTemplateVersion.displayVersion }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template v-slot="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
      <el-table-column prop="buildSize" label="构建/部署" width="80">
        <template v-slot="scope">
          <span>{{ scope.row.buildSize }}/{{ scope.row.deploySize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="80">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"></active-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleBuild(scope.row)">构建</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowUpgrade(scope.row)"
                     :disabled="scope.row.verifyTemplateVersion.isIdentical">升级</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)"
                     :disabled="scope.row.isActive">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <leo-job-editor :formStatus="formStatus.job" ref="jobEditor"
                    @close="fetchData"></leo-job-editor>
    <leo-do-build-kubernetes-image-editor :form-status="formStatus.build.kubernetesImage" ref="doBuildKubernetesImageEditor"/>
    <leo-do-build-maven-publish-editor :form-status="formStatus.build.mavenPublish" ref="doBuildMavenPublishEditor"/>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"/>
    <leo-build-history :form-status="formStatus.history" ref="leoBuildHistory"/>
  </div>
</template>

<script>

import {
  QUERY_LEO_JOB_PAGE,
  DELETE_LEO_JOB_BY_ID,
  UPGRADE_LEO_JOB_TEMPLATE_CONTENT
} from '@/api/modules/leo/leo.job.api'
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
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
import LeoBuildHistory from '@/components/opscloud/leo/LeoBuildHistory'
import LeoDoBuildKubernetesImageEditor from '@/components/opscloud/leo/LeoDoBuildKubernetesImageEditor.vue'
import LeoDoBuildMavenPublishEditor from '@/components/opscloud/leo/LeoDoBuildMavenPublishEditor.vue'

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
          kubernetesImage: {
            visible: false,
            labelWidth: '150px'
          },
          mavenPublish: {
            visible: false,
            labelWidth: '150px'
          }
        },
        history: {
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
    LeoDoBuildKubernetesImageEditor,
    LeoDoBuildMavenPublishEditor,
    LeoBuildHistory
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
      QUERY_MY_APPLICATION_PAGE(requestBody)
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
    handleAdd () {
      this.formStatus.job.visible = true
      this.formStatus.job.operationType = true
      const job = {
        id: '',
        parentId: 0,
        applicationId: '',
        name: '',
        jobKey: '',
        branch: '',
        envType: 0,
        jobConfig: '',
        buildNumber: 0,
        templateId: '',
        templateVersion: '',
        hide: false,
        href: '',
        isActive: true,
        comment: ''
      }
      this.$refs.jobEditor.initData(job)
    },
    handleRowEdit (row) {
      this.formStatus.job.visible = true
      this.formStatus.job.operationType = false
      this.$refs.jobEditor.initData(Object.assign({}, row))
    },
    handleRowUpgrade (row) {
      UPGRADE_LEO_JOB_TEMPLATE_CONTENT({ jobId: row.id })
        .then((res) => {
          this.$message.success('升级模板内容成功!')
          this.fetchData()
        })
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_LEO_JOB_BY_ID({ jobId: row.id }).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleBuild (row) {
      const buildType = row?.configDetails?.job?.build?.type || 'kubernetes-image'
      switch (buildType) {
        case 'maven-publish':
          this.formStatus.build.mavenPublish.visible = true
          this.$refs.doBuildMavenPublishEditor.initData(Object.assign({}, row))
          break
        default:
          this.formStatus.build.kubernetesImage.visible = true
          this.$refs.doBuildKubernetesImageEditor.initData(Object.assign({}, row))
      }
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
