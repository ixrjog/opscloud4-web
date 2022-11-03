<template>
  <div>
    <el-row>
      <el-card shadow="never">
        <my-highlight v-if="!editing && content !== ''" :code="content" lang="yaml" :myStyle="style"></my-highlight>
        <editor v-if="editing && JSON.stringify(content) !== '{}'" v-model="content" @init="editorInit"
                lang="yaml" theme="chrome" height="400" :options="options" ref="editor"></editor>
      </el-card>
    </el-row>
    <el-row>
      <div style="width:100%;text-align:center;margin-top:10px">
        <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑</el-button>
        <el-button size="mini" type="primary" @click="handleSave" v-show="editing">保存</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>

import MyHighlight from '@/components/opscloud/common/MyHighlight'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  name: 'LeoConfigEditor',
  props: [],
  data () {
    return {
      editing: false,
      content: '',
      options: options,
      style: { height: '400px' }
    }
  },
  components: {
    MyHighlight,
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
    handleEditing () {
      this.editing = true
    },
    open (config) {
      this.editing = false
      this.content = config
    },
    handleSave () {
      this.editing = false
      this.$emit('save', this.content)
    }
  }
}
</script>

<style scoped>

</style>
