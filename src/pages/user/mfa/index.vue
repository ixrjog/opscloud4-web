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
        <document-zone mount-zone="MFA"></document-zone>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import VueQr from 'vue-qr'
import { GET_USER_MFA, RESET_USER_MFA } from '@/api/modules/user/user.mfa.api'
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
