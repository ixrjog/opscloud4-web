<template>
  <d2-container>
      <div>
        <h1>{{title}}</h1>
      </div>
      <!--      顶部工具栏-->
      <el-row style="margin-left: -5px">
        <!--                        @resetTerminalSetting="initTerminalSetting"-->
        <terminal-tools ref="terminalTools"
                        :terminal-setting="terminalSetting" :mode="terminalTools.mode"
                        :batch-type="terminalTools.batchType"
                        @handlerLogin="handlerLogin"
                        @handlerLogout="handlerLogout"
                        @handlerChangeLoginUserType="handlerChangeLoginUserType"
                        @handlerChangeBatch="handlerChangeBatch"
                        @handlerChangeLayout="handlerChangeLayout"></terminal-tools>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!--          服务器树-->
          <server-tree class="server-tree" ref="serverTree" v-show="terminalLayout.servers.length === 0"></server-tree>
        </el-col>
        <el-col>
          <!--          终端布局-->
          <terminal-layout class="terminal-layout" ref="terminalLayout"
                           :terminal-setting="terminalSetting"
                           :servers="terminalLayout.servers"
                           :instanceIds="terminalLayout.instanceIds"
                           :uuid="terminalLayout.uuid"
                           :loginType="terminalLayout.loginType"
                           :colSpan="terminalLayout.colSpan"
                           @handlerLogoutByInstance="handlerLogoutByInstance"
                           @handlerLoginByInstanceId="handlerLoginByInstanceId"></terminal-layout>
        </el-col>
      </el-row>
  </d2-container>
</template>

<script>

import ServerTree from '../../../components/caesar/tree/ServerTree'
import TerminalTools from '../../../components/caesar/terminal/TerminalTools'
import TerminalLayout from '../../../components/caesar/terminal/TerminalLayout'

const terminalSetting = {
  theme: {
    foreground: '#FFFFFF', // 字体
    background: '#606266', // 背景色
    cursor: 'help', // 设置光标
    red: '#dd7479',
    blue: '#1BD1FF'
  },
  rows: 30
}

// const settingGroup = 'XTERM'

export default {
  props: {},
  data () {
    return {
      title: 'Web Terminal',
      layout: {
        mode: 0
      },
      terminalSetting: Object.assign({}, terminalSetting), // 终端设置
      terminalTools: {
        mode: 0, // 0未登录:1登录
        batchType: ''
      },
      terminalLayout: {
        instanceIds: [],
        serverNodes: [],
        servers: [],
        uuid: '',
        loginType: 0,
        colSpan: 12
      }
    }
  },
  mounted () {
    // this.initTerminalSetting()
  },
  beforeDestroy () {
    this.handlerLogout()
  },
  components: {
    ServerTree,
    TerminalTools,
    TerminalLayout
  },
  methods: {
    /**
       * 设置终端主题色彩
       */
    // initTerminalSetting () {
    //   queryUserSettingByGroup(settingGroup)
    //     .then(res => {
    //       if (res.success) {
    //         try {
    //           this.terminalSetting.theme.foreground = res.body.XTERM_FOREGROUND
    //           this.terminalSetting.theme.background = res.body.XTERM_BACKGROUND
    //           this.terminalSetting.rows = res.body.XTERM_ROWS || 30
    //         } catch (e) {
    //         }
    //       } else {
    //         this.$message.error(res.msg)
    //       }
    //     })
    // },
    handlerChangeBatch () {
      let isBatch = true
      if (this.terminalTools.batchType === '') {
        this.terminalTools.batchType = 'success'
      } else {
        this.terminalTools.batchType = ''
        isBatch = false
      }
      this.$refs.terminalLayout.handlerBatch(isBatch)
    },
    handlerChangeLoginUserType (loginUserType) {
      this.terminalLayout.loginUserType = loginUserType
    },
    handlerChangeLayout (mode) {
      this.layout.mode = mode
      this.terminalLayout.colSpan = mode === 0 ? 12 : 24 // 双列布局:单列布局
    },
    handlerLogin () {
      this.terminalTools.batchType = ''
      /**
       * List =>
       * id: "cc1-node-2"
         label: "cc1-node-2:172.16.210.247"
         server: (...)
       */
      // this.terminalLayout.instanceIds = this.$refs.serverTree.getCheckedKeys(true)
      const serverNodes = this.$refs.serverTree.getCheckedNodes(true)
      if (this.terminalLayout.instanceIds.length === 0) return
      // 如果用户只打开一个终端则自动切换为单列模式
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
      if (this.terminalLayout.instanceIds.length === 1) {
        this.handlerChangeLayout(1)
        this.$refs.terminalTools.setLayoutMode(1)
      }
      this.terminalTools.mode = 1
      this.terminalLayout.uuid = this.$refs.serverTree.getUuid()
      this.terminalLayout.servers = []
      for (const id of this.terminalLayout.instanceIds) {
        const server = {
          name: id
        }
        this.terminalLayout.servers.push(server)
      }
      this.$nextTick(() => {
        this.$refs.terminalLayout.open()
      })
    },
    handlerLoginByInstanceId (id) {
      const server = {
        name: id
      }
      this.terminalLayout.servers.push(server)
      this.$nextTick(() => {
        this.$refs.terminalLayout.openServer(server)
      })
    },
    /**
       * 所有终端退出
       */
    handlerLogout () {
      if (this.terminalLayout.instanceIds.length === 0) return
      this.terminalLayout.instanceIds.forEach(id => {
        const args = {
          id: id,
          isNotify: false
        }
        this.$refs.terminalLayout.handlerLogoutByInstance(args)
      }
      )
      this.$message.warning('所有终端已关闭')
      this.recovery()
    },
    /**
       * 单个终端退出
       * @param id
       */
    handlerLogoutByInstance (args) {
      this.terminalLayout.instanceIds = this.terminalLayout.instanceIds.filter(function (n) {
        return n !== args.id
      })
      this.terminalLayout.servers = this.terminalLayout.servers.filter(function (n) {
        return n.name !== args.id
      })
      if (args.isNotify) this.$message.warning(args.id + '终端已关闭')
      if (this.terminalLayout.instanceIds.length === 0) {
        this.recovery()
        this.$refs.terminalLayout.close()
      }
    },
    recovery () {
      this.$store.dispatch('d2admin/menu/asideCollapseSet', false)
      this.terminalTools.mode = 0
    }
  }
}

</script>

<style scoped>
  .el-button {
    margin-left: 5px
  }

  .server-tree {
    margin-top: 5px;
  }

  .terminal-layout {
    margin-top: 5px;
  }
</style>
