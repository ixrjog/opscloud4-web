<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model="layout.mode" size="mini" filterable reserve-keyword
                 @change="handleChangeLayout()">
        <el-option v-for="item in layoutModeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-select v-model="loginUserType" size="mini" filterable reserve-keyword style="margin-left: 5px"
                 @change="handleChangeLoginUserType">
        <el-option v-for="item in loginUserTypeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-tooltip class="item" effect="light" content="任意窗口输入指令同步到所有终端" placement="bottom">
        <el-button @click="handleChangeBatch" size="mini" v-if="mode === 1" :type="batchType" plain>Command sync</el-button>
      </el-tooltip>
      <el-button @click="handleSetting" size="mini">Terminal settings</el-button>
      <el-tooltip class="item" effect="light" content="单窗口最大化显示" placement="bottom">
        <el-button @click="handleFullScreen" v-if="mode === 1" size="mini">Full screen</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="修复终端字符错位" placement="bottom">
        <el-button @click="handleResize" v-if="mode === 1" size="mini">Resize</el-button>
      </el-tooltip>
      <el-button @click="handleLogin" type="primary" v-if="mode === 0" size="mini">Login all</el-button>
      <el-button @click="handleLogout" type="primary" v-if="mode === 1" size="mini">Logout all</el-button>
    </el-row>
    <user-terminal-settings ref="userTerminalSettings" :formStatus="formStatus.setting"/>
  </div>
</template>

<script>

import UserTerminalSettings from '../user/UserTerminalSettings'

const layoutModeOptions = [
  {
    value: 0,
    label: 'Double column'
  }, {
    value: 1,
    label: 'Single column'
  }
]

const loginUserTypeOptions = [
  {
    value: 0,
    label: 'Low privilege'
  }, {
    value: 1,
    label: 'Privilege'
  }
]

export default {
  name: 'TerminalTools',
  props: ['terminalSettings', 'mode', 'batchType'],
  components: {
    UserTerminalSettings
  },
  data () {
    return {
      layout: {
        mode: 0 // 当前布局模式
      },
      loginUserType: 1, // 登录用户类型
      loginUserTypeOptions: loginUserTypeOptions,
      layoutModeOptions: layoutModeOptions,
      formStatus: {
        setting: {
          visible: false
        },
        doc: {
          readMode: false, // 阅读模式
          visible: false
        }
      }
    }
  },
  methods: {
    setLayoutMode (layoutMode) {
      this.layout.mode = layoutMode
    },
    resetTerminalSettings () {
      this.$emit('resetTerminalSettings')
    },
    handleSetting () {
      this.$refs.userTerminalSettings.init()
      this.formStatus.setting.visible = true
    },
    handleChangeLayout () {
      this.$emit('handleChangeLayout', this.layout.mode)
    },
    handleChangeLoginUserType () {
      this.$emit('handleChangeLoginUserType', this.loginUserType)
    },
    handleChangeBatch () {
      this.$emit('handleChangeBatch')
    },
    handleFullScreen () {
      this.$emit('handleFullScreen')
    },
    handleResize () {
      this.$emit('handleResize')
    },
    handleLogin () {
      this.$emit('handleLogin')
    },
    handleLogout () {
      this.$emit('handleLogout')
    }
  }
}
</script>

<style scoped>

.el-button {
  margin-left: 5px;
}

</style>
