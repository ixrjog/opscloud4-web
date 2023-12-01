<!--suppress HtmlUnknownTag -->
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
                <span style="font-size: 12px">已分配MFA设备 <el-tag size="mini">{{ item.title }}</el-tag></span>
              </el-tooltip>
            </div>
            <el-card class="box-card" shadow="hover" style="margin-top: 15px">
              <el-col :span="10">
                <vue-qr :text="item.qrcode" :size="150"/>
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
        <document-zone mount-zone="MFA"/>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import VueQr from 'vue-qr'
import { GET_USER_IAM_MFA } from '@/api/modules/user/user.mfa.api'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  data () {
    return {
      mfa: null
    }
  },
  mounted () {
    this.fetchMfa()
  },
  components: {
    VueQr,
    DocumentZone
  },
  methods: {
    fetchMfa () {
      GET_USER_IAM_MFA()
        .then(res => {
          this.mfa = res.body
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
