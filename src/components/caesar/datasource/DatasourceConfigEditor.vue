<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="datasourceConfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数据源信息" name="dsInfo">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model="datasourceConfig.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="数据源类型" :label-width="labelWidth" required>
            <el-select v-model="datasourceConfig.dsType" placeholder="选择类型">
              <el-option
                v-for="item in dsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类" :label-width="labelWidth" required>
            <el-input v-model="datasourceConfig.kind" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="数据源接入点" :label-width="labelWidth">
            <el-input v-model="datasourceConfig.dsUrl" placeholder="请输入内容(url或接入点)"></el-input>
          </el-form-item>
          <el-form-item label="版本" :label-width="labelWidth">
            <el-input v-model="datasourceConfig.version" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="有效" :label-width="labelWidth" required>
            <el-select v-model="datasourceConfig.isActive" placeholder="选择类型">
              <el-option
                v-for="item in activeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="datasourceConfig.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="数据源属性" name="dsProps">
          <el-form-item label="凭据配置" label-position="top" required>
            <el-select v-model="datasourceConfig.credentialId" filterable clearable
                       remote reserve-keyword placeholder="输入关键词搜索凭据" :remote-method="getCredential">
              <el-option v-for="item in credentialOptions" :key="item.id" :label="item.title" :value="item.id">
                <select-item :name="item.title" :comment="item.username"></select-item>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="属性(YML)" label-position="top" required>
            <editor v-model="datasourceConfig.propsYml" @init="editorInit" lang="yaml" theme="chrome" height="400"
                    :options="options"></editor>
          </el-form-item>

        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { QUERY_CREDENTIAL_PAGE } from '@/api/modules/sys/sys.credential.api.js'
import { ADD_DATASOURCE_CONFIG, UPDATE_DATASOURCE_CONFIG } from '@/api/modules/datasource/datasource.config.api.js'
import SelectItem from '../common/SelectItem'

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
      datasourceConfig: {},
      allowOptions: allowOptions,
      options: options,
      credentialOptions: []
    }
  },
  name: 'DatasourceConfigEditor',
  props: ['formStatus', 'activeOptions', 'dsTypeOptions'],
  mixins: [],
  components: {
    editor: require('vue2-ace-editor'),
    SelectItem
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
    initData (datasourceConfig) {
      this.datasourceConfig = datasourceConfig
      if (datasourceConfig.credential !== null) {
        this.credentialOptions = []
        this.credentialOptions.push(datasourceConfig.credential)
      } else {
        this.getCredential('')
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
    handlerUpdate (requestBody) {
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
    handlerAdd (requestBody) {
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
    handlerSave () {
      const requestBody = Object.assign({}, this.datasourceConfig)
      if (this.formStatus.operationType) {
        this.handlerAdd(requestBody)
      } else {
        this.handlerUpdate(requestBody)
      }
    }
  }
}
</script>
