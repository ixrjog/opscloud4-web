<template>
  <el-dialog :title="document.displayName + formStatus.title" :visible.sync="formStatus.visible">
    <el-row>
      <my-markdown v-if="!editing" :content="document.content"></my-markdown>
      <editor v-if="editing" v-model="document.content" @init="editorInit" lang="yaml" theme="chrome"
              height="400"
              :options="options" ref="editor"></editor>
    </el-row>
    <el-row>
      <div style="width:100%;text-align:center;margin-top:10px">
        <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑文档</el-button>
        <el-button size="mini" type="primary" @click="openUrl" v-show="editing">上传助手</el-button>
        <el-button size="mini" type="primary" @click="save" v-show="editing">保存文档</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
// API
import { ADD_BUSINESS_DOCUMENT, UPDATE_BUSINESS_DOCUMENT } from '@/api/modules/business/business.document.api.js'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import util from '@/libs/util'

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
      labelWidth: '150px',
      editing: false,
      document: {},
      options: options
    }
  },
  name: 'BusinessDocRdader',
  props: ['formStatus'],
  mixins: [],
  components: {
    MyMarkdown,
    editor: require('vue2-ace-editor')
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
    initData (document) {
      this.editing = false
      if (document !== null) {
        this.document = document
      }
    },
    openUrl(){
      util.open('https://fe.chuanyinet.com/upload')
    },
    handleUpdate () {
      UPDATE_BUSINESS_DOCUMENT(this.document)
        .then(res => {
        })
    },
    handleAdd () {
      if (this.document.content === '') {
        return // 未编辑
      }
      ADD_BUSINESS_DOCUMENT(this.document)
        .then(res => {
        })
    },
    handleEditing () {
      this.editing = true
    },
    save () {
      this.editing = false
      if (this.document.id === '') {
        this.handleAdd()
      } else {
        this.handleUpdate()
      }
    }
  }
}
</script>

<style scoped>

</style>

