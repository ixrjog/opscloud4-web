<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="75%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="leoJob">
          <el-form-item label="显示名称" :label-width="formStatus.labelWidth" required>
            <el-input v-model="leoJob.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="任务主键" :label-width="formStatus.labelWidth" required>
            <el-input v-model="leoJob.jobKey" placeholder="请输入内容"
                      :disabled="leoJob.id !== '' && leoJob.id !== 0"></el-input>
          </el-form-item>
          <el-form-item label="应用" :label-width="formStatus.labelWidth" required>
            <el-select v-model.trim="leoJob.applicationId" filterable clearable
                       remote reserve-keyword placeholder="搜索应用" :remote-method="getApplication"
                       @clear="getApplication('')">
              <el-option
                v-for="item in applicationOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <select-item :name="item.name" :comment="item.comment"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务模板" :label-width="formStatus.labelWidth" required>
            <el-select v-model.trim="leoJob.templateId" filterable clearable
                       remote reserve-keyword placeholder="搜索任务模板" :remote-method="getTemplate"
                       @clear="getTemplate('')">
              <el-option
                v-for="item in templateOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <select-item :name="item.name" :comment="item.comment"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="formStatus.labelWidth" required>
            <el-select v-model.trim="leoJob.envType" clearable
                       remote reserve-keyword placeholder="选择环境" :remote-method="getEnv">
              <el-option
                v-for="item in envOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效" :label-width="formStatus.labelWidth" required>
            <el-select v-model="leoJob.isActive" placeholder="选择">
              <el-option
                v-for="item in activeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" :label-width="formStatus.labelWidth">
            <el-input v-model="leoJob.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="任务YML" name="ymlConfig">
        <el-row>
          <el-card shadow="never">
            <my-highlight v-if="!editing && leoJob.jobConfig !== ''" :code="leoJob.jobConfig"
                          lang="yaml" :myStyle="style"></my-highlight>
            <editor v-if="editing && JSON.stringify(leoJob.jobConfig) !== '{}'"
                    v-model="leoJob.jobConfig" @init="editorInit"
                    lang="yaml" theme="chrome" height="400" :options="options" ref="editor"
                    style="font-size: 10px; line-height: 110%;  padding: 0.5em;"></editor>
          </el-card>
        </el-row>
        <el-row>
          <div style="width:100%;text-align:center;margin-top:10px">
            <el-button size="mini" type="warning" @click="handleCreateCrRepository">创建CR仓库</el-button>
            <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑</el-button>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="模板内容" name="templateContent" :disabled="leoJob.id === '' || leoJob.id === 0">
        <el-row>
          <el-card shadow="never">
            <my-highlight v-if="!editing && JSON.stringify(leoJob.templateContent) !== '{}'"
                          :code="leoJob.templateContent"
                          lang="xml" :myStyle="style"></my-highlight>
          </el-card>
        </el-row>
        <el-row>
          <div style="width:100%;text-align:center;margin-top:10px">
            <el-button size="mini" type="primary" @click="handleUpgradeContent" v-show="!editing"
                       :loading="buttons.upgradeTemplateContent">升级
            </el-button>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="用户授权" name="permissionUser" v-if="leoJob.id !== ''&& leoJob.id !== 0">
        <permission-user-tab :businessType="businessType.LEO_JOB" :businessId="leoJob.id"
                             ref="permissionUserTab"></permission-user-tab>
      </el-tab-pane>
      <el-tab-pane label="文档" name="doc">
        <el-row>
          <el-card shadow="never">
            <my-markdown v-if="docs.job !== null" :content="docs.job.content"></my-markdown>
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import {
  ADD_LEO_JOB,
  UPDATE_LEO_JOB,
  UPGRADE_LEO_JOB_TEMPLATE_CONTENT,
  CREATE_CR_REPOSITORY_WITH_LEO_JOB_ID
} from '@/api/modules/leo/leo.job.api'

import MyHighlight from '@/components/opscloud/common/MyHighlight'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api'
import { QUERY_LEO_TEMPLATE_PAGE } from '@/api/modules/leo/leo.template.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'
import PermissionUserTab from '@/components/opscloud/user/child/BusinessPermissionUserTab.vue'
import BusinessType from '@/components/opscloud/common/enums/business.type'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

const docKeys = {
  LEO_JOB_README: 'LEO_JOB_README'
}

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  data () {
    return {
      activeName: 'base',
      docs: {
        job: null
      },
      docKeys: docKeys,
      leoJob: {},
      activeOptions: activeOptions,
      editing: false,
      options: options,
      style: { height: '400px' },
      envOptions: [],
      applicationOptions: [],
      templateOptions: [],
      buttons: {
        upgradeTemplateContent: false
      },
      businessType: BusinessType
    }
  },
  name: 'LeoJobEditor',
  props: ['formStatus'],
  components: {
    PermissionUserTab,
    MyHighlight,
    MyMarkdown,
    SelectItem,
    editor: require('vue2-ace-editor')
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
    handleEditing () {
      this.editing = true
    },
    initData (leoJob) {
      this.activeName = 'base'

      if (this.formStatus.operationType) {
        this.editing = true
      } else {
        this.editing = false
      }
      // 环境选项
      this.getEnv()
      // 模板选项
      if (leoJob.template !== undefined && JSON.stringify(leoJob.template) !== '{}') {
        this.templateOptions = []
        this.templateOptions.push(leoJob.template)
      } else {
        this.getTemplate('')
      }
      if (leoJob.application !== undefined && JSON.stringify(leoJob.application) !== '{}') {
        this.applicationOptions = []
        this.applicationOptions.push(leoJob.application)
      } else {
        this.getApplication('')
      }
      this.leoJob = leoJob
    },
    handleClick (tab, event) {
      if (tab.name === 'ymlConfig') {
        // this.editing = false
      }
      if (tab.name === 'permissionUser') {
        this.$refs.permissionUserTab.init()
      }
      if (tab.name === 'doc') {
        this.fetchDoc(this.docKeys.LEO_JOB_README)
      }
    },
    handleUpgradeContent () {
      this.buttons.upgradeTemplateContent = true
      UPGRADE_LEO_JOB_TEMPLATE_CONTENT({ jobId: this.leoJob.id })
        .then((res) => {
          this.$message.success('升级模板内容成功!')
          this.leoTemplate = res.body
          this.buttons.upgradeTemplateContent = false
        })
    },
    handleUpdate () {
      UPDATE_LEO_JOB(this.leoJob)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleCreateCrRepository () {
      CREATE_CR_REPOSITORY_WITH_LEO_JOB_ID({ jobId: this.leoJob.id })
        .then(() => {
          this.$message.success('创建CR仓库成功!')
        })
    },
    handleAdd () {
      ADD_LEO_JOB(this.leoJob)
        .then(() => {
          this.$message.success('新增成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleSave () {
      if (this.formStatus.operationType) {
        this.handleAdd()
      } else {
        this.handleUpdate()
      }
    },
    fetchDoc (key) {
      const requestBody = {
        dict: this.dict,
        documentKey: key
      }
      PREVIEW_DOCUMENT(requestBody)
        .then(res => {
          switch (key) {
            case this.docKeys.LEO_JOB_README:
              this.docs.job = res.body
              break
          }
        })
    }
  }
}
</script>
