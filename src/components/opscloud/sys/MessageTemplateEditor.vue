<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="50%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文档信息" name="base">
        <el-form :model="messageTemplate">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model="messageTemplate.name" placeholder="请输入内容"/>
          </el-form-item>
          <el-form-item label="Key" :label-width="labelWidth" required>
            <el-input v-model="messageTemplate.msgKey" placeholder="请输入内容" readonly/>
          </el-form-item>
          <el-form-item label="消息格式" :label-width="labelWidth" required>
            <el-input v-model="messageTemplate.msgType" placeholder="请输入内容" readonly/>
          </el-form-item>
          <el-form-item label="消费者" :label-width="labelWidth" required>
            <el-select v-model="messageTemplate.consumer" placeholder="选择">
              <el-option v-for="item in consumerOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="messageTemplate.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="消息模板内容" name="content">
        <my-markdown v-if="!editing" :content="messageTemplate.msgTemplate" :key="key"/>
        <editor v-if="editing" v-model="messageTemplate.msgTemplate" @init="editorInit" lang="yaml" theme="chrome"
                height="400"
                :options="options" ref="editor"/>
        <el-row v-if="false">
          <div style="width:100%;text-align:center;margin-top:10px">
            <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑文档</el-button>
            <el-button size="mini" type="primary" @click="openUrl" v-show="editing">上传助手</el-button>
            <el-button size="mini" type="primary" @click="save" v-show="editing">保存文档</el-button>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { UPDATE_MESSAGE_TEMPLATE } from '@/api/modules/template/message.template.api'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown.vue'
import util from '@/libs/util'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

const consumerOptions = [{
  value: 'DINGTALK_APP',
  label: '钉钉应用'
}, {
  value: 'DINGTALK_ROBOT',
  label: '钉钉机器人'
}]

export default {
  data () {
    return {
      activeName: 'base',
      key: 0,
      editing: true,
      labelWidth: '150px',
      messageTemplate: '',
      consumerOptions: consumerOptions,
      options: options
    }
  },
  name: 'MessageTemplateEditor',
  props: ['formStatus'],
  components: {
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
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
    },
    handleClick () {
      this.key++
    },
    openUrl () {
      util.open('https://fe.chuanyinet.com/upload')
    },
    handleEditing () {
      this.editing = true
    },
    initData (messageTemplate) {
      this.messageTemplate = messageTemplate
      this.activeName = 'base'
    },
    save () {
      UPDATE_MESSAGE_TEMPLATE(this.messageTemplate)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>
