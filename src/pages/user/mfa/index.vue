<template>
  <d2-container>
    <h1>Multi-Factor Authentication (MFA)</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
          <div slot="header" class="clearfix">
            <span>MFA QR code</span>
          </div>
          <!--          :logoSrc=""-->
          <vue-qr v-if="mfa !== null && mfa.userMfa.show" :text="mfa.userMfa.qrcode" :size="150"></vue-qr>
          <span v-else>验证通过后不再显示</span>
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
import { GET_USER_MFA } from '@/api/modules/user/user.mfa.api'

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
