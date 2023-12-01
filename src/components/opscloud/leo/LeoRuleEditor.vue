<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="50%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="leoRule">
          <el-form-item label="显示名称" :label-width="formStatus.labelWidth" required>
            <el-input v-model="leoRule.name" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="有效" :label-width="formStatus.labelWidth" required>
            <el-select v-model="leoRule.isActive" size="mini" placeholder="选择">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" :label-width="formStatus.labelWidth">
            <el-input v-model="leoRule.comment" placeholder="请输入内容" size="mini"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="规则YML" name="ruleConfig">
        <el-row>
          <el-card shadow="never">
            <my-highlight v-if="!editing && leoRule.ruleConfig !== ''" :code="leoRule.ruleConfig"
                          lang="yaml" :myStyle="style"/>
            <editor v-if="editing && JSON.stringify(leoRule.ruleConfig) !== '{}'"
                    v-model="leoRule.ruleConfig" @init="editorInit"
                    lang="yaml" theme="chrome" height="200" :options="options" ref="editor"
                    style="font-size: 12px; line-height: 110%;  padding: 0.5em;"/>
          </el-card>
        </el-row>
        <el-row>
          <div style="width:100%;text-align:center;margin-top:10px">
            <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑</el-button>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="文档" name="doc">
        <el-row>
          <el-card shadow="never">
            <my-markdown v-if="docs.rule !== null" :content="docs.rule.content"/>
          </el-card>
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
import { ADD_LEO_RULE, UPDATE_LEO_RULE } from '@/api/modules/leo/leo.rule.api'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

import MyHighlight from '@/components/opscloud/common/MyHighlight'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

const docKeys = {
  LEO_RULE_README: 'LEO_RULE_README'
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
      docs: {
        rule: null
      },
      docKeys: docKeys,
      leoRule: {},
      activeOptions: activeOptions,
      editing: false,
      options: options,
      style: { height: '200px' },
      envOptions: [],
      applicationOptions: [],
      templateOptions: [],
      buttons: {
        upgradeTemplateContent: false
      }
    }
  },
  name: 'LeoRuleEditor',
  props: ['formStatus'],
  components: {
    MyHighlight,
    MyMarkdown,
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
      require('brace/mode/xml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
      require('brace/snippets/xml')
    },
    handleEditing () {
      this.editing = true
    },
    initData (leoRule) {
      this.activeName = 'base'
      if (this.formStatus.operationType) {
        this.editing = true
      } else {
        this.editing = false
      }
      this.leoRule = leoRule
    },
    handleClick (tab, event) {
      if (tab.name === 'ruleConfig') {
        // this.editing = false
      }
      if (tab.name === 'doc') {
        this.fetchDoc(this.docKeys.LEO_RULE_README)
      }
    },
    handleUpdate () {
      UPDATE_LEO_RULE(this.leoRule)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd () {
      ADD_LEO_RULE(this.leoRule)
        .then(() => {
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
    },
    fetchDoc (key) {
      const requestBody = {
        dict: this.dict,
        documentKey: key
      }
      PREVIEW_DOCUMENT(requestBody)
        .then(res => {
          switch (key) {
            case this.docKeys.LEO_RULE_README:
              this.docs.rule = res.body
              break
          }
        })
    }
  }
}
</script>
