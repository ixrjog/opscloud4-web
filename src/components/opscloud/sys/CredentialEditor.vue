<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="credential">
      <el-form-item label="凭据标题" :label-width="labelWidth" required>
        <el-input v-model="credential.title" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="凭据分类" :label-width="labelWidth" :required="true">
        <el-select v-model="credential.kind" placeholder="选择分类" @change="handlerSelKind">
          <el-option v-for="item in kindOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="凭据账户" :label-width="labelWidth" :required="true">
        <el-input v-model="credential.username" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item :label="form.credentialLabel" :label-width="labelWidth" :required="true">
        <editor v-model="credential.credential"
                @init="editorInit"
                theme="chrome"
                :height="form.credentialHeight"
                :options="options"/>
      </el-form-item>
      <el-form-item :label="form.credential2Label"
                    :label-width="labelWidth"
                    :required="true"
                    v-if="form.showCredential2">
        <editor v-model="credential.credential2"
                @init="editorInit"
                theme="chrome"
                height="100"
                :options="options"/>
      </el-form-item>
      <el-form-item label="密码短语" :label-width="labelWidth" v-show="form.showPassphrase">
        <el-input v-model="credential.passphrase" placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { ADD_CREDENTIAL, UPDATE_CREDENTIAL } from '@/api/modules/sys/sys.credential.api.js'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: false,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: false,
  showPrintMargin: false,
  fontSize: 6
}

export default {
  data () {
    return {
      credential: '',
      options: options,
      form: {
        credentialLabel: '凭据',
        showCredential2: false,
        showPassphrase: false
      },
      labelWidth: '150px'
    }
  },
  name: 'CredentialEditor',
  props: ['formStatus', 'kindOptions'],
  components: {
    editor: require('vue2-ace-editor')
  },
  mounted () {
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      // require('brace/ext/language_tools')
      // language
      // require('brace/mode/yaml')
      require('brace/theme/chrome')
      // snippet
      // require('brace/snippets/yaml')
    },
    initData (credential) {
      this.credential = credential
      this.handlerSelKind()
    },
    handlerSelKind () {
      this.form.showCredential2 = false
      this.form.showPassphrase = false
      this.form.credentialHeight = 50
      switch (this.credential.kind) {
        case 1:
          this.form.credentialLabel = '凭据(密码)'
          break
        case 2:
          this.form.showPassphrase = true
          this.form.credentialLabel = '凭据(私钥)'
          this.form.credentialHeight = 450
          break
        case 3:
          this.form.showCredential2 = true
          this.form.showPassphrase = true
          this.form.credentialHeight = 450
          this.form.credential2Label = '公钥'
          this.form.credentialLabel = '凭据(私钥)'
          break
        case 4:
          this.form.credentialLabel = '凭据(令牌)'
          break
        case 5: // Access Key
          this.form.showCredential2 = true
          this.form.credentialHeight = 50
          this.form.credentialLabel = 'AccessKey'
          this.form.credential2Label = 'SecretKey'
          break
        case 6: // Kube Config
          this.form.showCredential2 = false
          this.form.credentialHeight = 500
          this.form.credentialLabel = 'KubeConfig'
          break
      }
    },
    handlerUpdate (requestBody) {
      UPDATE_CREDENTIAL(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerAdd (requestBody) {
      ADD_CREDENTIAL(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerSave () {
      if (this.formStatus.operationType) {
        this.handlerAdd(this.credential)
      } else {
        this.handlerUpdate(this.credential)
      }
    }
  }
}
</script>

<style scoped>

</style>
