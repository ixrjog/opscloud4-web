<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="template">
          <el-form-item label="名称" :label-width="labelWidth">
            <el-input v-model.trim="template.name" placeholder="不填写则自动生成"></el-input>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required>
            <el-select v-model.trim="template.envType" clearable
                       remote reserve-keyword placeholder="选择环境" :remote-method="getEnv"
                       :disabled="!formStatus.operationType && template.bizTemplateSize > 0">
              <el-option
                v-for="item in envOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
                <select-item :name="item.envName" :comment="item.comment"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实例类型" :label-width="labelWidth" required>
            <el-select v-model="template.instanceType" placeholder="选择类型" @change="handleChangeInstanceType"
                       :disabled="!formStatus.operationType && template.bizTemplateSize > 0">
              <el-option
                v-for="item in instanceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板Key" :label-width="labelWidth" required>
            <el-select v-model="template.templateKey" placeholder="选择类型"
                       :disabled="!formStatus.operationType && template.bizTemplateSize > 0">
              <el-option
                v-for="item in keyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="template.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Template" name="template" v-if="template !== '' && template.id !== ''">
        <el-form :model="template" label-position="top">
          <el-form-item label="模板">
            <my-highlight v-show="!button.editing" :code="template.content"
                          :lang="template.templateType" myStyle="style"></my-highlight>
            <editor v-if="button.editing" v-model="template.content"
                    @init="editorInit"
                    :lang="template.templateType"
                    theme="chrome"
                    height="300"
                    :options="options"></editor>
          </el-form-item>
          <el-form-item label="变量">
            <my-highlight v-show="!button.editing" :code="template.vars"
                          :lang="template.templateType"></my-highlight>
            <editor v-if="button.editing" v-model="template.vars"
                    @init="editorInit"
                    :lang="template.templateType"
                    theme="chrome"
                    height="150"
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
                 :disabled="button.creating" :loading="button.creating" v-show="template.id === ''">新增
      </el-button>
      <el-button size="mini" type="primary" @click="handleUpdate"
                 :disabled="button.ok" :loading="button.ok" v-show="template.id !== ''">确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { QUERY_TEMPLATE_PAGE, ADD_TEMPLATE, UPDATE_TEMPLATE } from '@/api/modules/template/template.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import SelectItem from '@/components/opscloud/common/SelectItem'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

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
      keyOptions: keyOptions,
      template: '',
      button: {
        editing: false,
        ok: false,
        creating: false
      },
      style: { height: '400px' }
    }
  },
  name: 'TemplateEditor',
  props: ['formStatus', 'instanceTypeOptions'],
  components: {
    MyHighlight,
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
    handleChangeInstanceType () {

    },
    initData (template) {
      this.activeName = 'base'
      this.button = {
        editing: false,
        ok: false,
        creating: false
      }
      this.template = template
    },
    handleEditing () {
      this.button.editing = true
    },
    handleUpdate () {
      this.button.ok = true
      UPDATE_TEMPLATE(this.template).then(() => {
        this.$message.success('保存成功!')
        this.formStatus.visible = false
        this.$emit('close')
      }).catch(() => {
        this.button.ok = false
      })
    },
    handleAdd () {
      this.button.creating = true
      ADD_TEMPLATE(this.template).then((res) => {
        this.template = res.body
        this.$message.success('新增成功!')
      }).catch(() => {
        this.button.creating = false
      })
    }
  }
}
</script>

<style scoped>
</style>
