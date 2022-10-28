<template>
  <div>
    <el-row>
      <el-card shadow="never">
        <my-markdown v-if="!editing && content !== ''" :content="content"></my-markdown>
        <editor v-if="editing && JSON.stringify(document) !== '{}'" v-model="content" @init="editorInit"
                lang="yaml" theme="chrome" height="400" :options="options" ref="editor"></editor>
      </el-card>
    </el-row>
    <el-row>
      <div style="width:100%;text-align:center;margin-top:10px">
        <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑文档</el-button>
        <el-button size="mini" type="primary" @click="openUrl" v-show="editing">上传助手</el-button>
        <el-button size="mini" type="primary" @click="save" v-show="editing">保存文档</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
// API
import { SAVE_BUSINESS_DOCUMENT } from '@/api/modules/business/business.document.api.js'
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
      options: options,
      content: ''
    }
  },
  name: 'BusinessDocEditor',
  props: ['businessType', 'businessId'],
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
    open (document) {
      this.editing = false
      if (document !== null) {
        this.document = document
        this.content = document.content
      } else {
        this.document = {
          id: '',
          businessType: this.businessType,
          businessId: this.businessId,
          documentType: 1,
          content: ''
        }
        this.content = ''
      }
    },
    openUrl () {
      util.open('https://fe.chuanyinet.com/upload')
    },
    handleEditing () {
      this.editing = true
    },
    save () {
      this.editing = false
      this.document.content = this.content
      SAVE_BUSINESS_DOCUMENT(this.document)
        .then(res => {
          this.$message.success('保存成功!')
        })
    }
  }
}
</script>

<style scoped>

</style>
