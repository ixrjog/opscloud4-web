<template>
  <div>
    <el-row>
      <el-select v-model="layout.mode" filterable reserve-keyword
                 @change="handleChangeLayout()">
        <el-option
          v-for="item in layoutModeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="loginUserType" filterable reserve-keyword style="margin-left: 5px"
                 @change="handleChangeLoginUserType">
        <el-option
          v-for="item in loginUserTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="light" content="任意窗口输入指令同步到所有终端" placement="bottom">
        <el-button @click="handleChangeBatch" v-if="mode === 1" :type="batchType"
                   plain>命令同步
        </el-button>
      </el-tooltip>
      <!--      <el-tooltip class="item" effect="light" content="您的个人文档，用于记录常用指令" placement="bottom">-->
      <!--        <el-button @click="handlerPreviewUserDoc">用户文档</el-button>-->
      <!--      </el-tooltip>-->
      <el-button @click="handleSetting">终端设置</el-button>
      <el-tooltip class="item" effect="light" content="修复终端字符错位" placement="bottom">
        <el-button @click="handleResize" v-if="mode === 1">调整大小</el-button>
      </el-tooltip>
      <el-button @click="handleLogin" type="primary" v-if="mode === 0">批量登录</el-button>
      <el-button @click="handleLogout" type="primary" v-if="mode === 1">全部关闭</el-button>
    </el-row>
    <!--    <doc-dialog ref="docDialog" :formStatus="formStatus.doc"></doc-dialog>-->
    <user-terminal-setting ref="userTerminalSetting"
                           :formStatus="formStatus.setting"></user-terminal-setting>
  </div>
</template>

<script>

// import DocDialog from '@/components/opscloud/doc/DocDialog.vue'
// import UserTerminalSetting from '../setting/UserTerminalSetting'
//
// import { queryUserDocByType } from '@api/doc/doc.js'

import UserTerminalSetting from '../user/UserTerminalSetting'

const layoutModeOptions = [
  {
    value: 0,
    label: '双列布局'
  }, {
    value: 1,
    label: '单列布局'
  }
]

const loginUserTypeOptions = [
  {
    value: 0,
    label: '普通用户'
  }, {
    value: 1,
    label: '系统管理员'
  }
]

export default {
  name: 'TerminalTools',
  props: ['terminalSetting', 'mode', 'batchType'],
  components: {
    UserTerminalSetting
  },
  data () {
    return {
      layout: {
        mode: 0 // 当前布局模式
      },
      loginUserType: 0, // 登录用户类型
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
    resetTerminalSetting () {
      this.$emit('resetTerminalSetting')
    },
    handleSetting () {
      this.$refs.userTerminalSetting.init()
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
