<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="datasourceConfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数据源信息" name="dsInfo">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model="datasourceConfig.name" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="数据源类型" :label-width="labelWidth" required>
            <el-select v-model="datasourceConfig.dsType" size="mini" placeholder="选择类型">
              <el-option v-for="item in dsTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类" :label-width="labelWidth" required>
            <el-input v-model="datasourceConfig.kind" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="数据源接入点" :label-width="labelWidth">
            <el-input v-model="datasourceConfig.dsUrl" placeholder="请输入内容(url或接入点)" size="mini"/>
          </el-form-item>
          <el-form-item label="版本" :label-width="labelWidth">
            <el-input v-model="datasourceConfig.version" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="有效" :label-width="labelWidth" required>
            <el-select v-model="datasourceConfig.isActive" size="mini" placeholder="选择类型">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="datasourceConfig.comment" placeholder="请输入内容" size="mini"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="数据源属性" name="dsProps">
          <el-form-item label="凭据配置" label-position="top">
            <el-select v-model.trim="credential" size="mini" value-key="id" filterable clearable
                       remote reserve-keyword placeholder="输入关键词搜索凭据" :remote-method="getCredential"
                       style="width: 300px">
              <el-option v-for="item in credentialOptions"
                         :key="item.id"
                         :label="item.title"
                         :value="item">
                <select-item :name="item.title" :comment="item.username"/>
              </el-option>
            </el-select>
            <el-card shadow="never" style="margin-top: 5px;background: #e56c0d" v-if="credential !== ''">
              <credential-kind-example-tag :kinds="credentialKindOptions"
                                           :kind="credential.kind"/>
            </el-card>
          </el-form-item>
          <el-form-item label="属性(YML)" label-position="top" required>
            <br/>
            <my-highlight v-if="!editing" :code="datasourceConfig.propsYml" lang="yaml"/>
            <editor v-if="editing" v-model="datasourceConfig.propsYml" @init="editorInit" lang="yaml" theme="chrome"
                    height="400"
                    :options="options"/>
          </el-form-item>
          <div style="width:100%;text-align:center">
            <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑属性</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { GET_CREDENTIAL_KIND_OPTIONS, QUERY_CREDENTIAL_PAGE } from '@/api/modules/sys/sys.credential.api.js'
import { ADD_DATASOURCE_CONFIG, UPDATE_DATASOURCE_CONFIG } from '@/api/modules/datasource/datasource.config.api.js'
import SelectItem from '../common/SelectItem'
import CredentialKindExampleTag from '@/components/opscloud/common/tag/CredentialKindExampleTag'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

const allowOptions = [{
  value: false,
  label: '禁止'
}, {
  value: true,
  label: '允许'
}]

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  data () {
    return {
      activeName: 'dsInfo',
      labelWidth: '150px',
      editing: false,
      datasourceConfig: {},
      allowOptions: allowOptions,
      options: options,
      credential: '',
      credentialOptions: [],
      credentialKindOptions: []
    }
  },
  name: 'DatasourceConfigEditor',
  props: ['formStatus', 'activeOptions', 'dsTypeOptions'],
  mixins: [],
  components: {
    MyHighlight,
    editor: require('vue2-ace-editor'),
    SelectItem,
    CredentialKindExampleTag
  },
  mounted () {
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
    getCredentialKindOptions () {
      GET_CREDENTIAL_KIND_OPTIONS()
        .then(res => {
          this.credentialKindOptions = res.body.options
        })
    },
    initData (datasourceConfig) {
      this.getCredentialKindOptions()
      this.datasourceConfig = datasourceConfig
      if (datasourceConfig.credential !== undefined && datasourceConfig.credential !== null) {
        this.credentialOptions = []
        this.credential = datasourceConfig.credential
        this.credentialOptions.push(this.credential)
      } else {
        this.getCredential('')
      }
      if (datasourceConfig.propsYml === null || datasourceConfig.propsYml === '') {
        this.editing = true
      } else {
        this.editing = false
      }
    },
    handleClick () {
    },
    getCredential (queryName) {
      const requestBody = {
        queryName: queryName,
        kind: '',
        page: 1,
        length: 10
      }
      QUERY_CREDENTIAL_PAGE(requestBody)
        .then(res => {
          this.credentialOptions = res.body.data
        })
    },
    handleUpdate (requestBody) {
      UPDATE_DATASOURCE_CONFIG(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd (requestBody) {
      ADD_DATASOURCE_CONFIG(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleEditing () {
      this.editing = true
    },
    handleSave () {
      const requestBody = Object.assign({}, this.datasourceConfig)
      // credentialId
      if (this.credential !== null && this.credential !== '') {
        requestBody.credentialId = this.credential.id
      } else {
        requestBody.credentialId = ''
      }
      if (this.formStatus.operationType) {
        this.handleAdd(requestBody)
      } else {
        this.handleUpdate(requestBody)
      }
    }
  }
}
</script>

<style scoped>
</style>
