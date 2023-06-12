<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <div v-show="terminalLayout.terminals.length === 0">
      <h1>{{ title }}</h1>
    </div>
    <!--      顶部工具栏-->
    <el-row>
      <!--                        @resetTerminalSetting="initTerminalSetting"-->
      <terminal-tools ref="terminalTools"
                      :terminalSettings="terminalSettings" :mode="terminalTools.mode"
                      :batchType="terminalTools.batchType"
                      @handleLogin="handleLogin"
                      @handleLogout="handleLogout"
                      @handleChangeLoginUserType="handleChangeLoginUserType"
                      @handleChangeBatch="handleChangeBatch"
                      @handleChangeLayout="handleChangeLayout"
                      @handleResize="handleResize"/>
    </el-row>
    <el-row>
      <el-col :span="8">
        <!--          服务器树-->
        <server-tree class="server-tree" ref="serverTree" v-show="terminalLayout.terminals.length === 0"/>
      </el-col>
      <el-col>
        <!--          终端布局-->
        <terminal-layout class="terminal-layout" ref="terminalLayout"
                         :terminalSettings="terminalSettings"
                         :terminals="terminalLayout.terminals"
                         :uuid="terminalLayout.uuid"
                         :loginType="terminalLayout.loginType"
                         :colSpan="terminalLayout.colSpan"
                         @handleLogoutByServerNode="handleLogoutByServerNode"
                         @handleLoginByServerNode="handleLoginByServerNode"
                         @handleRead="handleRead"/>
      </el-col>
    </el-row>
    <business-doc-reader :form-status="formStatus.businessDoc"
                         ref="businessDocReader"/>
  </d2-container>
</template>

<script>

import ServerTree from '../../../components/opscloud/tree/ServerTree'
import TerminalTools from '../../../components/opscloud/terminal/TerminalTools'
import TerminalLayout from '../../../components/opscloud/terminal/TerminalLayout'

import { mapState } from 'vuex'
import BusinessDocReader from '@/components/opscloud/business/BusinessDocReader'
import TerminalSettings from '@/components/opscloud/common/enums/terminal.settings.js'

export default {
  name: 'web-terminal',
  props: {},
  data () {
    return {
      title: 'Web Terminal',
      layout: {
        mode: 0
      },
      terminalSettings: {},
      terminalTools: {
        mode: 0, // 0未登录:1登录
        batchType: ''
      },
      terminalLayout: {
        serverNodes: [],
        terminals: [],
        uuid: '',
        loginType: 1,
        colSpan: 12
      },
      formStatus: {
        businessDoc: {
          visible: false,
          title: '服务器文档'
        }
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mounted () {
    this.initTerminalSettings()
  },
  beforeDestroy () {
    this.handleLogout()
  },
  components: {
    ServerTree,
    TerminalTools,
    TerminalLayout,
    BusinessDocReader
  },
  methods: {
    /**
     * 设置终端主题色彩
     */
    initTerminalSettings () {
      if (typeof (this.info.terminalSettings) !== 'undefined') {
        this.terminalSettings = this.info.terminalSettings
      } else {
        this.terminalSettings = TerminalSettings
      }
    },
    handleRead (server) {
      this.$refs.businessDocReader.initData(Object.assign({}, server.document))
      this.formStatus.businessDoc.visible = true
    },
    handleChangeBatch () {
      let isBatch = true
      if (this.terminalTools.batchType === '') {
        this.terminalTools.batchType = 'success'
      } else {
        this.terminalTools.batchType = ''
        isBatch = false
      }
      this.$refs.terminalLayout.handleBatch(isBatch)
    },
    handleChangeLoginUserType (loginUserType) {
      this.terminalLayout.loginType = loginUserType
    },
    handleChangeLayout (mode) {
      this.layout.mode = mode
      this.terminalLayout.colSpan = mode === 0 ? 12 : 24 // 双列布局:单列布局
      this.handleResize()
    },
    handleResize () {
      this.$refs.terminalLayout.handleResize()
    },
    handleLogin () {
      this.terminalTools.batchType = ''
      /**
       * serverNodes [
       * {
       *   id: "cc1-node-2"
         label: "cc1-node-2:172.16.210.247"
         server: (...)
       * }
       * ]
       */
      this.terminalLayout.serverNodes = this.$refs.serverTree.getCheckedNodes(true)
      if (this.terminalLayout.serverNodes.length === 0) return
      // 如果用户只打开一个终端则自动切换为单列模式
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
      if (this.terminalLayout.serverNodes.length === 1) {
        this.handleChangeLayout(1)
        this.$refs.terminalTools.setLayoutMode(1)
      }
      this.terminalTools.mode = 1
      this.terminalLayout.uuid = this.$refs.serverTree.getUuid()
      this.terminalLayout.terminals = []
      for (const node of this.terminalLayout.serverNodes) {
        const serverNode = {
          ...node.server,
          instanceId: node.id,
          label: node.label
        }
        this.terminalLayout.terminals.push(serverNode)
      }
      this.$nextTick(() => {
        this.$refs.terminalLayout.open()
      })
    },
    handleLoginByServerNode (serverNode) {
      this.terminalLayout.terminals.push(serverNode)
      this.$nextTick(() => {
        this.$refs.terminalLayout.openServer(serverNode)
      })
    },
    /**
     * 所有终端退出
     */
    handleLogout () {
      if (this.terminalLayout.serverNodes.length === 0) return
      this.terminalLayout.terminals.forEach(
        serverNode => {
          const args = {
            server: serverNode,
            isNotify: false
          }
          this.$refs.terminalLayout.handleLogout(args)
        }
      )
      this.$message.warning('所有终端已关闭')
      this.recovery()
    },
    /**
     * {
     * server : {},
     * isNotify : boolean
     * }
     * 单个终端退出
     * @param id
     */
    handleLogoutByServerNode (serverNode) {
      this.terminalLayout.serverNodes = this.terminalLayout.serverNodes.filter(function (n) {
        return n.id !== serverNode.server.instanceId
      })
      this.terminalLayout.terminals = this.terminalLayout.terminals.filter(function (n) {
        return n.instanceId !== serverNode.server.instanceId
      })
      if (serverNode.isNotify) this.$message.warning(serverNode.server.instanceId + '终端已关闭')
      if (this.terminalLayout.serverNodes.length === 0) {
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
