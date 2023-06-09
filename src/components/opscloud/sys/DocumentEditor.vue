<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="50%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文档信息" name="base">
        <el-form :model="document">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model="document.name" placeholder="请输入内容"/>
          </el-form-item>
          <el-form-item label="文档挂载区" :label-width="labelWidth" required>
            <el-select v-model="document.mountZone" filterable clearable
                       remote reserve-keyword placeholder="搜索文档挂载区" :remote-method="getZone"
                       @clear="getZone('')">
              <el-option v-for="item in zoneOptions"
                         :key="item.id"
                         :label="item.mountZone"
                         :value="item.mountZone">
                <select-item :name="item.mountZone" :comment="item.name"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效" :label-width="labelWidth" required>
            <el-select v-model="document.isActive" placeholder="选择">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标" :label-width="labelWidth" required>
            <el-input v-model="document.icon">
              <template slot="append"><i :class="document.icon"/></template>
            </el-input>
          </el-form-item>
          <el-form-item label="文档Key" :label-width="labelWidth" required>
            <el-input v-model="document.documentKey"/>
          </el-form-item>
          <el-form-item label="序列" :label-width="labelWidth" required>
            <el-input v-model="document.seq"/>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="document.comment" placeholder="请输入内容"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="文档内容" name="content">
        <my-markdown v-if="!editing" :content="document.content" :key="key"/>
        <editor v-if="editing" v-model="document.content" @init="editorInit" lang="yaml" theme="chrome"
                height="400"
                :options="options" ref="editor"/>
        <el-row>
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
import { QUERY_DOCUMENT_ZONE_PAGE, UPDATE_DOCUMENT, ADD_DOCUMENT } from '@/api/modules/sys/sys.doc.api'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown.vue'
import util from '@/libs/util'

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
      key: 0,
      editing: false,
      activeOptions: activeOptions,
      labelWidth: '150px',
      document: '',
      zoneOptions: [],
      options: options
    }
  },
  name: 'DocumentEditor',
  props: ['formStatus'],
  components: {
    SelectItem,
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
    getZone (name) {
      const requestBody = {
        queryName: name,
        page: 1,
        length: 20
      }
      QUERY_DOCUMENT_ZONE_PAGE(requestBody)
        .then(res => {
          this.zoneOptions = res.body.data
        })
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
    initData (document) {
      this.editing = false
      this.document = document
      this.activeName = 'base'
      if (this.formStatus.operationType) {
        this.getZone('')
      } else {
        this.getZone(document.mountZone)
      }
    },
    saveDoc () {
      this.editing = false
      UPDATE_DOCUMENT(this.document)
        .then(() => {
          this.$message.success('保存成功!')
        })
    },
    save () {
      if (this.formStatus.operationType) {
        ADD_DOCUMENT(this.document)
          .then(() => {
            this.$message.success('新增成功!')
            this.formStatus.visible = false
            this.$emit('close')
          })
      } else {
        UPDATE_DOCUMENT(this.document)
          .then(() => {
            this.$message.success('保存成功!')
            this.formStatus.visible = false
            this.$emit('close')
          })
      }
    }
  }
}
</script>
