<template>
  <div>
    <el-form :model="businessProperty">
      <el-form-item label="属性(YML)" label-position="top">
        <br/>
        <my-highlight v-if="!editing" :code="businessProperty.property" lang="yaml"></my-highlight>
        <editor v-if="editing" v-model="businessProperty.property" @init="editorInit" lang="yaml" theme="chrome"
                height="400"
                :options="options" ref="editor"></editor>
      </el-form-item>
    </el-form>
    <div style="width:100%;text-align:center">
      <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑属性</el-button>
      <el-button size="mini" type="primary" @click="save" v-show="editing">保存属性</el-button>
    </div>
  </div>
</template>

<script>
// API
import { ADD_BUSINESS_PROPERTY, UPDATE_BUSINESS_PROPERTY } from '@/api/modules/business/business.property.api.js'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

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
      businessProperty: {},
      options: options
    }
  },
  name: 'BusinessPropertyEditor',
  props: ['businessType', 'businessId'],
  mixins: [],
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
    initData (businessProperty) {
      this.editing = false
      if (businessProperty !== null) {
        this.businessProperty = businessProperty
      } else {
        this.businessProperty = {
          id: '',
          businessType: this.businessType,
          businessId: this.businessId,
          property: ''
        }
      }
    },
    handleClick () {
    },
    handleUpdate () {
      UPDATE_BUSINESS_PROPERTY(this.businessProperty)
        .then(res => {
        })
    },
    handleAdd () {
      if (this.businessProperty.property === '') {
        return // 未编辑
      }
      ADD_BUSINESS_PROPERTY(this.businessProperty)
        .then(res => {
        })
    },
    handleEditing () {
      this.editing = true
    },
    save () {
      // const requestBody = Object.assign({}, this.businessProperty)
      this.editing = false
      if (this.businessProperty.id === '') {
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
