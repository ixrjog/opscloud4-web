<template>
  <d2-container>
    <h1>Multi-Factor Authentication (MFA)</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
          <div slot="header" class="clearfix">
            <span>认证管理</span>
            <el-button type="primary" size="mini" style="float: right" @click="handleReset">重置MFA</el-button>
          </div>
          <div style="line-height: 150%">
            <span style="font-size: 10px">虚拟 MFA，是遵循 TOTP 标准算法产生 6 位数字验证码的应用程序</span>
          </div>
          <div v-if="mfa !== null" style="line-height: 150%">
            <span style="font-size: 10px">设备状态 <el-tag :type="mfa.mfa ? 'success': 'info'" size="mini">{{
                mfa.mfa ? '已启用' : '未启用'
              }}</el-tag></span>
            <br/>
            <span style="font-size: 10px">强制启用MFA <el-tag
              :type="mfa.forceMfa ? 'success': 'info'" size="mini">{{ mfa.forceMfa ? '是' : '否' }}</el-tag></span>
          </div>
          <el-card class="box-card" shadow="hover" style="margin-top: 15px" v-if="mfa !== null && mfa.userMfa.show">
            <div slot="header" class="clearfix">
              <span>QR code</span>
            </div>
            <!--          :logoSrc=""-->
            <vue-qr :text="mfa.userMfa.qrcode" :size="150"></vue-qr>
          </el-card>
        </el-card>
      </el-col>
      <el-col :span="16">
        <markdown-it-vue v-if="doc !== null" :content="doc.content" :options="options"></markdown-it-vue>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>


import VueQr from 'vue-qr'
import MarkdownItVue from 'markdown-it-vue'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'
import { GET_USER_MFA, RESET_USER_MFA } from '@/api/modules/user/user.mfa.api'

const documentKey = 'MFA_README'

export default {
  data () {
    return {
      mfa: null,
      doc: null,
      documentKey: documentKey,
      dict: {
        // sshServerHost: window.location.hostname
      },
      options: {
        markdownIt: {
          html: true,
          linkify: true
        }
      }
    }
  },
  mounted () {
    this.fetchMfa()
    this.fetchDoc()
  },
  components: {
    VueQr,
    MarkdownItVue
  },
  methods: {
    handleReset () {
      RESET_USER_MFA()
        .then(res => {
          this.mfa = res.body
        })
    },
    fetchMfa () {
      GET_USER_MFA()
        .then(res => {
          this.mfa = res.body
        })
    },
    fetchDoc () {
      const requestBody = {
        dict: this.dict,
        documentKey: this.documentKey
      }
      PREVIEW_DOCUMENT(requestBody)
        .then(res => {
          this.doc = res.body
        })
    }
  }
}

</script>


<style scoped>
>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

>>> .el-card__body {
  padding: 10px 10px;
}
</style>
