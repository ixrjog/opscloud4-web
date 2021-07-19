<template>
  <d2-container>
    <el-row :gutter="20" v-show="!layout.status">
      <el-col :span="18">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>服务器列表</span>
          </div>
          <remote-server-selector @handleRemote="handleRemote"></remote-server-selector>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>远程连接设置[RDP/VNC]</span>
          </div>
          <screen-setting @handleSetting="handleSetting"></screen-setting>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <remote-item-layout v-if="remoteItemLayout.show"
                          :remoteServer="remoteServer"
                          @logout="handleLogout"
                          ref="remoteItemLayout">
      </remote-item-layout>
    </el-row>
  </d2-container>
</template>

<script>

import RemoteServerSelector from '../../../components/opscloud/server/RemoteServerSelector'
import ScreenSetting from '../../../components/opscloud/remote/ScreenSetting'
import RemoteItemLayout from '../../../components/opscloud/remote/RemoteItemLayout'
import util from '@/libs/util'

export default {
  name: 'RemoteDesktop',
  data () {
    return {
      remoteItemLayout: {
        show: false
      },
      screenSetting: {
        screenResolution: '1280x640',
        screenDpi: 96
      },
      remoteServer: null,
      layout: {
        status: false // true开启远程
      }
    }
  },
  components: {
    RemoteServerSelector,
    ScreenSetting,
    RemoteItemLayout
  },
  mounted () {
  },
  methods: {
    handleRemote (remoteServer) {
      remoteServer.params = {
        token: util.cookies.get('token'),
        screenWidth: this.screenSetting.screenResolution.split('x')[0],
        screenHeight: this.screenSetting.screenResolution.split('x')[1],
        screenDpi: this.screenSetting.screenDpi,
        ...remoteServer.params
      }
      this.remoteServer = remoteServer
      this.layout.status = true
      this.remoteItemLayout.show = true
      this.$nextTick(() => {
        this.$refs.remoteItemLayout.connect()
      })
    },
    handleSetting (screenSetting) {
      this.screenSetting = screenSetting
    },
    handleLogout () {
      this.$nextTick(() => {
        this.layout.status = false
        this.remoteItemLayout.show = false
      })
    }
  }
}
</script>

<style>
.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
