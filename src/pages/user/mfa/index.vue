<template>
  <d2-container>
    <h1>Multi-Factor Authentication</h1>
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
            <el-tooltip class="item" effect="dark" content="启用后登录平台必须输入OTP" placement="top-start">
              <span style="font-size: 10px">设备状态 <el-tag :type="mfa.mfa ? 'success': 'info'" size="mini">{{
                  mfa.mfa ? '已启用' : '未启用'
                }}</el-tag></span>
            </el-tooltip>
            <br/>
            <el-tooltip class="item" effect="dark" content="用户无法重置MFA" placement="top-start">
                   <span style="font-size: 10px">强制启用MFA <el-tag
                     :type="mfa.forceMfa ? 'success': 'info'" size="mini">{{ mfa.forceMfa ? '是' : '否' }}</el-tag></span>
            </el-tooltip>
          </div>
          <el-card class="box-card" shadow="hover" style="margin-top: 15px" v-if="mfa !== null && mfa.userMfa.show">
            <el-col :span="10">
              <vue-qr :text="mfa.userMfa.qrcode" :size="150"></vue-qr>
            </el-col>
            <el-col :span="14">
              <div style="margin: 0 auto; position: relative; transform: translateY(100%)">
                <span style="color: #9d9fa3"><i class="fab fa-chromecast"></i> 使用您的虚拟 MFA 应用程序扫描 QR 码</span>
              </div>
            </el-col>
          </el-card>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="fab fa-chrome"></i> Chrome</span>
            <markdown-it-vue v-if="docs.chrome !== null" :content="docs.chrome.content" :options="options"></markdown-it-vue>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="fab fa-apple"></i> iOS</span>
            <markdown-it-vue v-if="docs.ios !== null" :content="docs.ios.content" :options="options"></markdown-it-vue>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="fab fa-android"></i> Android</span>
            <markdown-it-vue v-if="docs.android !== null" :content="docs.android.content" :options="options"></markdown-it-vue>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>


import VueQr from 'vue-qr'
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import 'highlight.js/scss/default.scss'
import 'highlight.js/styles/vs2015.css'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'
import { GET_USER_MFA, RESET_USER_MFA } from '@/api/modules/user/user.mfa.api'

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
              this.docs.ios =  res.body
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


<style>
>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

>>> .el-card__body {
  padding: 10px 10px;
}


pre {
  /*控制代码不换行*/
  white-space: pre;
  word-wrap: normal;
  background: #535353 !important;
  border-radius: 4px;
  font-size: 8px;
}

.markdown-body {
  font-size: 10px;
}

</style>
