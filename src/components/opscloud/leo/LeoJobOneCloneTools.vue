<!--suppress HtmlUnknownTag -->
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="单任务复制">
      <el-row>
        <el-select v-model.trim="queryParam.applicationId" size="mini" filterable clearable @change="fetchData"
                   remote reserve-keyword placeholder="选择应用" :remote-method="getApplication">
          <el-option v-for="item in applicationOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
            <select-item :name="item.name" :comment="item.comment"/>
          </el-option>
        </el-select>
        <el-radio-group v-model="queryParam.envType" size="mini" @change="fetchData">
          <el-radio-button v-for="env in envOptions" :label="env.envType" :key="env.envType">
            {{ env.envName }}
          </el-radio-button>
        </el-radio-group>
      </el-row>
      <div style="height: 5px"/>
      <el-row>
        <el-card shadow="hover">
          <el-form :model="clone">
            <el-form-item label="任务名称" label-width="100px" required>
              <el-input v-model="clone.jobName" placeholder="${applicationName}-${env}" style="width: 500px"
                        size="mini"/>
            </el-form-item>
            <el-form-item label="任务YAML" label-width="100px">
              <editor v-model="clone.jobConfig" @init="editorInit"
                      lang="yaml" theme="chrome" height="250" :options="options" ref="editor"
                      style="font-size: 12px; line-height: 110%;  padding: 0.5em"/>
            </el-form-item>
          </el-form>
        </el-card>
      </el-row>
      <div style="height: 5px"/>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="name" label="名称" sortable/>
        <el-table-column prop="application" label="应用">
          <template v-slot="scope">
            <el-tooltip class="item" effect="light"
                        :content="scope.row.application.comment === '' ? '未定义': scope.row.application.comment"
                        placement="top-start">
              <el-tag size="mini">{{ scope.row.application.name }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
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
          </template>
        </el-table-column>
        <el-table-column prop="template" label="模板版本">
          <template v-slot="scope">
            <el-tag size="mini" :type="scope.row.verifyTemplateVersion.type">
              {{ scope.row.verifyTemplateVersion.displayVersion }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="jobConfig" label="任务配置" width="80">
          <template v-slot="scope">
            <yaml-view :yaml-content="scope.row.jobConfig"/>
          </template>
        </el-table-column>
        <el-table-column prop="env" label="环境" width="80">
          <template v-slot="scope">
            <env-tag :env="scope.row.env"/>
          </template>
        </el-table-column>
        <el-table-column prop="buildSize" label="构建次数" width="80">
        </el-table-column>
        <el-table-column prop="isActive" label="有效" width="80">
          <template v-slot="scope">
            <active-tag :is-active="scope.row.isActive"/>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
          <template v-slot="scope">
            <business-tags :tags="scope.row.tags"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template v-slot="scope">
            <el-button type="primary" plain size="mini" @click="handleClone(scope.row)">复制</el-button>
            <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
            <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
            <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)"
                       :disabled="scope.row.buildSize !==0">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                           :form-status="formStatus.businessTag" @close="fetchData"/>
      <leo-job-editor :formStatus="formStatus.job" ref="jobEditor" @close="fetchData"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import BusinessType from '@/components/opscloud/common/enums/business.type'
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import {
  CLONE_LEO_ONE_JOB,
  DELETE_LEO_JOB_BY_ID,
  QUERY_LEO_JOB_PAGE
} from '@/api/modules/leo/leo.job.api'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'
import EnvTag from '@/components/opscloud/common/tag/EnvTag.vue'
import BusinessTagEditor from '@/components/opscloud/common/tag/BusinessTagEditor.vue'
import LeoJobEditor from '@/components/opscloud/leo/LeoJobEditor.vue'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import ActiveTag from '@/components/opscloud/common/tag/ActiveTag.vue'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import YamlView from '@/components/opscloud/common/view/YamlView.vue'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  name: 'LeoJobEnvCloneTools',
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
      options: options,
      clone: {
        jobName: '${applicationName}-${env}',
        jobConfig: '',
        cloneTag: true
      },
      queryParam: {
        envType: 1,
        applicationId: '',
        cloneTag: true
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
        }
      },
      tagOptions: [],
      businessType: BusinessType.LEO_JOB,
      envOptions: [],
      applicationOptions: []
    }
  },
  components: {
    YamlView,
    SelectItem,
    EnvTag,
    BusinessTags,
    ActiveTag,
    BusinessTagEditor,
    LeoJobEditor,
    editor: require('vue2-ace-editor')
  },
  mounted () {
    this.getEnv()
    this.getApplication('')
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
    getEnv () {
      const requestBody = {
        envName: '',
        isActive: true,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
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
    handleClone (row) {
      const requestBody = {
        jobId: row.id,
        ...this.clone
      }
      CLONE_LEO_ONE_JOB(requestBody)
        .then(res => {
          this.$message.success('复制成功!')
          this.fetchData()
        })
    },
    fetchData () {
      if (this.queryParam.applicationId === '') return
      this.table.loading = true
      const requestBody = {
        queryName: '',
        applicationId: this.queryParam.applicationId,
        templateId: '',
        envType: this.queryParam.envType,
        tagId: '',
        isActive: '',
        extend: true,
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

<style lang="less" scoped>

.el-input {
  display: inline-block;
}

.el-select {
  margin-right: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
