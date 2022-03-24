<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="playbook">
      <el-form-item label="名称" :label-width="labelWidth" :required="true">
        <el-input v-model="playbook.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="Playbook" :label-width="labelWidth" :required="true">
        <my-highlight v-show="!editing" :code="playbook.playbook" lang="yaml"></my-highlight>
        <editor v-show="editing" v-model="playbook.playbook" @init="editorInit" lang="yaml" theme="chrome"
                height="250"
                :options="options"></editor>
      </el-form-item>
      <el-form-item label="Vars" :label-width="labelWidth">
        <my-highlight v-show="!editing" :code="playbook.vars" lang="yaml"></my-highlight>
        <editor v-show="editing" v-model="playbook.vars" @init="editorInit" lang="yaml" theme="chrome"
                height="80"
                :options="options"></editor>
      </el-form-item>
      <el-form-item label="Tags" :label-width="labelWidth">
        <my-highlight v-show="!editing" :code="playbook.tags" lang="yaml"></my-highlight>
        <editor v-show="editing" v-model="playbook.tags" @init="editorInit" lang="yaml" theme="chrome"
                height="80"
                :options="options"></editor>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="playbook.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div style="width:100%;text-align:center">
      <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑属性</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { ADD_ANSIBLE_PLAYBOOK, UPDATE_ANSIBLE_PLAYBOOK } from '@/api/modules/task/task.playbook.api.js'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  name: 'AnsiblePlaybookEditor',
  props: ['formStatus'],
  data () {
    return {
      playbook: '',
      labelWidth: '150px',
      editing: false,
      options: options
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
    initData (playbook) {
      this.playbook = playbook
      if (this.playbook.id === '') {
        this.editing = true
      } else {
        this.editing = false
      }
    },
    handleEditing () {
      this.editing = true
    },
    handleUpdate () {
      UPDATE_ANSIBLE_PLAYBOOK(this.playbook)
        .then(res => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd () {
      ADD_ANSIBLE_PLAYBOOK(this.playbook)
        .then(res => {
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
    }
  }
}
</script>

<style scoped>
</style>
