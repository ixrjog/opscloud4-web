<template>
  <div>
    <el-form :model="businessProperty">
      <el-form-item label="属性(YML)" label-position="top" required>
        <editor v-model="businessProperty.property" @init="editorInit" lang="yaml" theme="chrome" height="400"
                :options="options"></editor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// API
import { ADD_BUSINESS_PROPERTY, UPDATE_BUSINESS_PROPERTY } from '@/api/modules/business/business.property.api.js'
import SelectItem from '../common/SelectItem'

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
      businessProperty: {},
      options: options
    }
  },
  name: 'BusinessPropertyEditor',
  props: ['businessType', 'businessId'],
  mixins: [],
  components: {
    editor: require('vue2-ace-editor'),
    SelectItem
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
    save () {
      // const requestBody = Object.assign({}, this.businessProperty)
      if (this.businessProperty.id === '') {
        this.handleAdd()
      } else {
        this.handleUpdate()
      }
    }
  }
}
</script>
