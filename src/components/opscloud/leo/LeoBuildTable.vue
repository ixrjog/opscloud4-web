<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model.trim="queryParam.applicationId" size="mini" filterable clearable
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="fetchData">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.envType" size="mini" clearable filterable
                 remote reserve-keyword placeholder="输入关键词搜索环境" :remote-method="getEnv"
                 @change="fetchData">
        <el-option v-for="item in envOptions"
                   :key="item.id"
                   :label="item.envName"
                   :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.buildResult" size="mini" clearable filterable placeholder="选择构建结果"
                 @change="fetchData">
        <el-option v-for="item in buildResultOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" size="mini" class="button"><i class="fas fa-circle-notch"/></el-button>
    </el-row>
    <div style="height: 5px"/>
    <div v-for="build in table.data" :key="build.id" style="font-size: 12px">
      <template>
        <div>
          <leo-build-details :build="build" :ref="`leoBuildDetails_${build.id}`"/>
        </div>
      </template>
    </div>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" v-if="false">
      <el-table-column prop="name" label="名称" sortable/>
      <el-table-column prop="branch" label="首选分支" sortable>
        <template v-slot="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"/>
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template v-slot="scope">
          <env-tag :env="scope.row.env"/>
        </template>
      </el-table-column>
      <el-table-column prop="buildSize" label="构建次数" width="80">
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleBuild(scope.row)">构建</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <leo-job-editor :formStatus="formStatus.job" ref="jobEditor"
                    @close="fetchData"/>
    <leo-do-build-kubernetes-image-editor :form-status="formStatus.build.kubernetesImage"
                                          ref="doBuildKubernetesImageEditor"/>
    <leo-do-build-maven-publish-editor :form-status="formStatus.build.mavenPublish" ref="doBuildMavenPublishEditor"/>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"/>
  </div>
</template>

<script>

import { DELETE_LEO_JOB_BY_ID, QUERY_LEO_JOB_BUILD_PAGE } from '@/api/modules/leo/leo.job.api'
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'

import SelectItem from '../common/SelectItem'
import BusinessTags from '../common/tag/BusinessTags'
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import Pagination from '../common/page/Pagination'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import EnvTag from '@/components/opscloud/common/tag/EnvTag'
import { QUERY_LEO_TEMPLATE_PAGE } from '@/api/modules/leo/leo.template.api'
import LeoJobEditor from '@/components/opscloud/leo/LeoJobEditor'
import LeoBuildDetails from '@/components/opscloud/leo/LeoBuildDetails.vue'
import LeoDoBuildMavenPublishEditor from '@/components/opscloud/leo/LeoDoBuildMavenPublishEditor.vue'
import LeoDoBuildKubernetesImageEditor from '@/components/opscloud/leo/LeoDoBuildKubernetesImageEditor.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const buildResultOptions = [{
  value: 'SUCCESS',
  label: 'SUCCESS'
}, {
  value: 'ABORTED',
  label: 'ABORTED'
}, {
  value: 'FAILURE',
  label: 'FAILURE'
}, {
  value: 'UNSTABLE',
  label: 'UNSTABLE'
}, {
  value: 'ERROR',
  label: 'ERROR'
}

]

export default {
  name: 'leoBuildTable',
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
        }
      },
      queryParam: {
        queryName: '',
        applicationId: '',
        templateId: '',
        envType: '',
        tagId: '',
        buildResult: '',
        isActive: '',
        extend: true
      },
      tagOptions: [],
      businessType: BusinessType.LEO_JOB,
      applicationOptions: [],
      templateOptions: [],
      envOptions: [],
      buildResultOptions: buildResultOptions,
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
    EnvTag,
    BusinessTagEditor,
    LeoJobEditor,
    /**
     * 默认 kubernetes-image
     */
    LeoDoBuildKubernetesImageEditor,
    LeoDoBuildMavenPublishEditor,
    LeoBuildDetails
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
      this.formStatus.build.kubernetesImage.visible = true
      this.$refs.doBuildKubernetesImageEditor.initData(Object.assign({}, row))
    },
    fetchData () {
      if (this.queryParam.applicationId === '') return
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LEO_JOB_BUILD_PAGE(requestBody)
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
  margin-right: 5px;
}

</style>
