<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="75%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="leoTemplate">
          <el-form-item label="显示名称" :label-width="formStatus.labelWidth" required>
            <el-input v-model="leoTemplate.name" placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item label="有效" :label-width="formStatus.labelWidth" required>
            <el-select v-model="leoTemplate.isActive" placeholder="选择">
              <el-option
                v-for="item in activeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" :label-width="formStatus.labelWidth">
            <el-input v-model="leoTemplate.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="模板YML" name="ymlConfig" :disabled="leoTemplate.id === '' || leoTemplate.id === 0">
        <el-row>
          <el-card shadow="never">
            <my-highlight v-if="!editing && leoTemplate.templateConfig !== ''" :code="leoTemplate.templateConfig"
                          lang="yaml" :myStyle="style"></my-highlight>
            <editor v-if="editing && JSON.stringify(leoTemplate.templateConfig) !== '{}'"
                    v-model="leoTemplate.templateConfig" @init="editorInit"
                    lang="yaml" theme="chrome" height="400" :options="options" ref="editor"></editor>
          </el-card>
        </el-row>
        <el-row>
          <div style="width:100%;text-align:center;margin-top:10px">
            <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑</el-button>
          </div>
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
import { ADD_LEO_TEMPLATE, UPDATE_LEO_TEMPLATE } from '@/api/modules/leo/leo.template.api'

import MyHighlight from '@/components/opscloud/common/MyHighlight'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
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
      leoTemplate: '',
      activeOptions: activeOptions,
      editing: false,
      options: options,
      style: { height: '400px' }
    }
  },
  name: 'LeoTemplateEditor',
  props: ['formStatus'],
  components: {
    MyHighlight,
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
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
    },
    handleEditing () {
      this.editing = true
    },
    initData (leoTemplate) {
      this.activeName = 'base'
      this.leoTemplate = leoTemplate
    },
    handleClick (tab, event) {
      if (tab.name === 'ymlConfig') {
        this.editing = false
      }
    },
    handleUpdate (requestBody) {
      UPDATE_LEO_TEMPLATE(requestBody)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd (requestBody) {
      ADD_LEO_TEMPLATE(requestBody)
        .then(() => {
          this.$message.success('新增成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleSave () {
      if (this.formStatus.operationType) {
        this.handleAdd(this.leoTemplate)
      } else {
        this.handleUpdate(this.leoTemplate)
      }
    }
  }
}
</script>
