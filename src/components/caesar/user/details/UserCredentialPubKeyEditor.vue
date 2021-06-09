<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible" :before-close="close">
    <el-form :model="userCredential">
      <el-form-item label="标题" :label-width="formStatus.labelWidth">
        <el-input v-model="userCredential.title" placeholder="自动识别" readonly></el-input>
      </el-form-item>
      <el-form-item label="公钥指纹" :label-width="formStatus.labelWidth">
        <el-input v-model="userCredential.fingerprint" placeholder="自动识别" readonly></el-input>
      </el-form-item>
      <el-form-item label="公钥" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="userCredential.credential" type="textarea"
                  :autosize="{ minRows: 4, maxRows: 16}" clearable placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { SAVE_USER_CREDENTIAL } from '@/api/modules/user/user.credential.api.js'

export default {
  data () {
    return {
      userCredential: {}
    }
  },
  name: 'UserCredentialPubKeyEditor',
  props: ['formStatus'],
  mixins: [],
  mounted () {
  },
  mutation () {
  },
  methods: {
    initData (userCredential) {
      this.userCredential = userCredential
    },
    close () {
      this.formStatus.visible = false
      this.$emit('fetchData')
    },
    saveInfo () {
      SAVE_USER_CREDENTIAL(this.userCredential)
        .then(res => {
          this.$message.success('保存成功！')
          this.close()
        })
    }
  }
}
</script>


<style scoped>

</style>
