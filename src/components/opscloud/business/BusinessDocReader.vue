<template>
  <el-dialog :title="document.displayName + formStatus.title" :visible.sync="formStatus.visible">
    <el-row>
      <el-card shadow="never">
        <my-markdown v-if="!editing" :content="doc.content"></my-markdown>
        <editor v-if="editing" v-model="doc.content" @init="editorInit" lang="yaml" theme="chrome"
                height="400"
                :options="options" ref="editor"></editor>
      </el-card>
    </el-row>
    <el-row>
      <div style="width:100%;text-align:center;margin-top:10px">
        <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑文档</el-button>
        <el-button size="mini" type="primary" @click="openUrl" v-show="editing">上传助手</el-button>
        <el-button size="mini" type="primary" @click="saveDoc" v-show="editing">保存文档</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
// API
import {
  GET_BUSINESS_DOCUMENT_BY_UNIQUE_KEY, SAVE_BUSINESS_DOCUMENT
} from '@/api/modules/business/business.document.api.js'
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
  name: 'business-doc-reader',
  data () {
    return {
      labelWidth: '150px',
      editing: false,
      document: {},
      doc: '',
      options: options
    }
  },
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
      this.fetchDoc()
    },
    openUrl () {
      util.open('https://fe.chuanyinet.com/upload')
    },
    handleEditing () {
      this.editing = true
    },
    saveDoc () {
      this.editing = false
      SAVE_BUSINESS_DOCUMENT(this.doc)
        .then(res => {
          this.$message.success('保存成功!')
        })
    },
    fetchDoc () {
      const param = {
        businessType: this.document.businessType,
        businessId: this.document.businessId
      }
      GET_BUSINESS_DOCUMENT_BY_UNIQUE_KEY(param)
        .then(res => {
          this.doc = res.body
        })
    }
  }
}
</script>

<style scoped>

</style>
