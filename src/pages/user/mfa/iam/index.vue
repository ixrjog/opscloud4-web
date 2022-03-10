<template>
  <d2-container>
    <h1>AWS IAM (虚拟)MFA</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <div v-if="mfa !== null">
          <el-card class="box-card" v-for="item in mfa.userMfas" :key="item.title" shadow="hover"
                   style="margin-bottom: 10px">
            <div slot="header" class="clearfix">
              <span>登录凭证</span>
            </div>
            <div style="line-height: 150%">
              <el-tooltip class="item" effect="dark" content="启用后登录平台必须输入OTP" placement="top-start">
                <span style="font-size: 10px">已分配MFA设备 <el-tag size="mini">{{ item.title }}</el-tag></span>
              </el-tooltip>
            </div>
            <el-card class="box-card" shadow="hover" style="margin-top: 15px">
              <el-col :span="10">
                <vue-qr :text="item.qrcode" :size="150"></vue-qr>
              </el-col>
              <el-col :span="14">
                <div style="margin: 0 auto; position: relative; transform: translateY(100%)">
                  <span style="color: #9d9fa3"><i class="fab fa-chromecast"></i> 使用您的虚拟 MFA 应用程序扫描 QR 码</span>
                </div>
              </el-col>
            </el-card>
          </el-card>
        </div>
      </el-col>
      <el-col :span="16">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="fab fa-chrome"></i> Chrome</span>
            <markdown-it-vue v-if="docs.chrome !== null" :content="docs.chrome.content"
                             :options="options"></markdown-it-vue>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="fab fa-apple"></i> iOS</span>
            <markdown-it-vue v-if="docs.ios !== null" :content="docs.ios.content" :options="options"></markdown-it-vue>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="fab fa-android"></i> Android</span>
            <markdown-it-vue v-if="docs.android !== null" :content="docs.android.content"
                             :options="options"></markdown-it-vue>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>


import VueQr from 'vue-qr'
import MarkdownItVue from 'markdown-it-vue'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'
import { GET_USER_IAM_MFA } from '@/api/modules/user/user.mfa.api'

const docKeys = {
  MFA_CHROME_README: 'MFA_CHROME_README',
  MFA_IOS_README: 'MFA_IOS_README',
  MFA_ANDROID_README: 'MFA_ANDROID_README'
}

export default {
  data () {
    return {
      mfa: null,
      docs: {
        chrome: null,
        ios: null,
        android: null
      },
      docKeys: docKeys,
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
    this.fetchDoc(this.docKeys.MFA_CHROME_README)
    this.fetchDoc(this.docKeys.MFA_IOS_README)
    this.fetchDoc(this.docKeys.MFA_ANDROID_README)
  },
  components: {
    VueQr,
    MarkdownItVue
  },
  methods: {
    fetchMfa () {
      GET_USER_IAM_MFA()
        .then(res => {
          this.mfa = res.body
        })
    },
    fetchDoc (key) {
      const requestBody = {
        dict: this.dict,
        documentKey: key
      }
      PREVIEW_DOCUMENT(requestBody)
        .then(res => {
          switch (key) {
            case this.docKeys.MFA_CHROME_README:
              this.docs.chrome = res.body
              break
            case this.docKeys.MFA_IOS_README:
              this.docs.ios = res.body
              break
            case this.docKeys.MFA_ANDROID_README:
              this.docs.android = res.body
              break
          }
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
