<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="businessTemplate">
          <el-form-item label="名称" :label-width="labelWidth">
            <el-input v-model.trim="businessTemplate.name" placeholder="不填写则自动生成"></el-input>
          </el-form-item>
          <el-form-item label="实例类型" :label-width="labelWidth" required>
            <el-select v-model="queryParam.instanceType" placeholder="选择类型">
              <el-option
                v-for="item in instanceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required>
            <el-select v-model.trim="queryParam.envType" clearable
                       remote reserve-keyword placeholder="选择环境" :remote-method="getEnv" @change="handleChangeTemplate">
              <el-option
                v-for="item in envOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
                <select-item :name="item.envName" :comment="item.comment"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板Key" :label-width="labelWidth" required>
            <el-select v-model="queryParam.templateKey" placeholder="选择类型" @change="handleChangeTemplate">
              <el-option
                v-for="item in keyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板" :label-width="labelWidth" required>
            <el-select v-model="businessTemplate.templateId" filterable clearable
                       :disabled="queryParam.templateKey === '' || businessTemplate.envType === ''"
                       remote reserve-keyword placeholder="选择模板" :remote-method="getTemplate" @clear="getTemplate('')">
              <el-option
                v-for="item in templateOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <select-item :name="item.name" :comment="item.templateKey"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="businessTemplate.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Template" name="template" v-if="businessTemplate !== '' && businessTemplate.id !== ''">
        <el-form :model="businessTemplate" label-position="top">
          <el-form-item label="模板">
            <d2-highlight :code="businessTemplate.template.content" class="content"
                          :lang="businessTemplate.template.templateType">
            </d2-highlight>
          </el-form-item>
          <el-form-item label="变量">
            <d2-highlight v-show="!button.editing" :code="businessTemplate.vars" class="vars"
                          :lang="businessTemplate.template.templateType">
            </d2-highlight>
            <editor v-if="button.editing" v-model="businessTemplate.vars"
                    @init="editorInit"
                    :lang="businessTemplate.template.templateType"
                    theme="chrome"
                    height="200"
                    :options="options"></editor>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="handleEditing" v-show="!button.editing">编辑属性</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleAdd"
                 :disabled="button.creating" :loading="button.creating" v-show="businessTemplate.id === ''">新增
      </el-button>
      <el-button size="mini" type="primary" @click="handleUpdate"
                 :disabled="button.ok" :loading="button.ok" v-show="businessTemplate.id !== ''">确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { ADD_BUSINESS_TEMPLATE, UPDATE_BUSINESS_TEMPLATE } from '@/api/modules/template/business.template.api.js'
import { QUERY_TEMPLATE_PAGE } from '@/api/modules/template/template.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import SelectItem from '@/components/opscloud/common/SelectItem'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

const keyOptions = [{
  value: 'DEPLOYMENT',
  label: 'DEPLOYMENT'
}, {
  value: 'SERVICE',
  label: 'SERVICE'
}]

export default {
  data () {
    return {
      activeName: 'base',
      labelWidth: '150px',
      options: options,
      envOptions: [],
      templateOptions: [],
      keyOptions: keyOptions,
      businessTemplate: '',
      queryParam: {
        envType: '',
        instanceType: '',
        templateKey: 'DEPLOYMENT'
      },
      button: {
        editing: false,
        ok: false,
        creating: false
      }
    }
  },
  name: 'BusinessTemplateEditor',
  props: ['formStatus', 'instanceTypeOptions'],
  components: {
    SelectItem,
    editor: require('vue2-ace-editor')
  },
  mixins: [],
  mounted () {
    this.getEnv('')
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      require('brace/ext/language_tools')
      // language
      require('brace/mode/yaml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
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
    getTemplate (name) {
      if (this.queryParam.envType === '') return
      const requestBody = {
        queryName: name,
        ...this.queryParam,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_TEMPLATE_PAGE(requestBody)
        .then(res => {
          this.templateOptions = res.body.data
        })
    },
    handleChangeTemplate () {
      this.businessTemplate.templateId = ''
      this.getTemplate('')
    },
    initData (businessTemplate, instanceType) {
      this.activeName = 'base'
      this.button = {
        editing: false,
        ok: false,
        creating: false
      }
      this.businessTemplate = businessTemplate
      this.queryParam.instanceType = instanceType
      this.queryParam.envType = this.businessTemplate.envType
      if (this.businessTemplate.template === undefined) {
        this.getTemplate('')
      } else {
        this.templateOptions = []
        this.templateOptions.push(this.businessTemplate.template)
      }
    },
    handleEditing () {
      this.button.editing = true
    },
    handleUpdate () {
      this.button.ok = true
      UPDATE_BUSINESS_TEMPLATE(this.businessTemplate)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
        .catch((err) => this.button.ok = false)
    },
    handleAdd () {
      this.button.creating = true
      ADD_BUSINESS_TEMPLATE(this.businessTemplate)
        .then((res) => {
          this.businessTemplate = res.body
          this.$message.success('新增成功!')
        })
        .catch((err) => this.button.creating = false)
    }
  }
}
</script>

<style scoped>

.content {
  margin-top: 5px;
  font-size: 10px;
  background-color: #dad8c8;
  line-height: 110%;
  height: 400px;
}

.vars {
  margin-top: 5px;
  font-size: 10px;
  background-color: #dad8c8;
  line-height: 110%;
}

</style>
