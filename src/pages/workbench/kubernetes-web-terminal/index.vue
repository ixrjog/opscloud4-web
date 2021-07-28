<template>
  <d2-container>
    <div v-show="layout.status === 0">
      <h1>{{title}}</h1>
    </div>
    <!--      应用选择器-->
    <el-row v-if="layout.status === 0">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>应用列表</span>
        </div>
        <application-kubernetes-selector @handleOpen="handleOpen"></application-kubernetes-selector>
      </el-card>
    </el-row>
    <el-row>
      <!--          终端布局-->
      <kubernetes-terminal-layout class="terminal-layout" ref="terminalLayout"
                                  :loginParam="terminalLayout.loginParam"
                                  :terminalSetting="terminalSetting"
                                  :containers="terminalLayout.containers"
                                  :colSpan="terminalLayout.colSpan"
                                  @handleLogoutByContainer="handleLogoutByContainer">
      </kubernetes-terminal-layout>
    </el-row>
  </d2-container>
</template>

<script>

import TerminalTools from '../../../components/opscloud/terminal/TerminalTools'

import { mapState } from 'vuex'
import ApplicationKubernetesSelector
  from '../../../components/opscloud/terminal/kubernetes/ApplicationKubernetesSelector'
import KubernetesTerminalLayout from '../../../components/opscloud/terminal/kubernetes/KubernetesTerminalLayout'

export default {
  props: {},
  data () {
    return {
      title: '容器管理',
      layout: {
        mode: 0,
        status: 0 // 0 选择/登录
      },
      terminalSetting: {
        theme: {
          foreground: '#FFFFFF', // 字体
          background: '#606266', // 背景色
          cursor: 'help', // 设置光标
          red: '#dd7479',
          blue: '#1BD1FF'
        },
        rows: 30
      },
      terminalTools: {
        mode: 0, // 0未登录:1登录
        batchType: ''
      },
      terminalLayout: {
        loginParam: '',
        containers: [],
        colSpan: 24
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mounted () {
    this.initTerminalSetting()
  },
  beforeDestroy () {
    this.handleLogout()
  },
  components: {
    ApplicationKubernetesSelector,
    TerminalTools,
    KubernetesTerminalLayout
  },
  methods: {
    /**
     * 设置终端主题色彩
     */
    initTerminalSetting () {
      if (typeof (this.info.terminalSetting) !== 'undefined') {
        this.terminalSetting.theme.foreground = this.info.terminalSetting.theme.foreground
        this.terminalSetting.theme.background = this.info.terminalSetting.theme.background
        this.terminalSetting.rows = this.info.terminalSetting.rows
      }
    },
    handleOpen (loginParam) {
      this.layout.status = 1
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
      this.terminalLayout.loginParam = loginParam
      // 转换容器终端数据
      let containers = []
      loginParam.data.pods.forEach(pod => {
        pod.containers.forEach(c => {
          const container = {
            ...c,
            podIp: pod.podIp,
            namespace: pod.namespace,
            sessionType: loginParam.sessionType
          }
          containers.push(container)
        })
      })
      this.terminalLayout.containers = containers
      this.$refs.terminalLayout.open()
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
      //this.terminalTools.batchType = ''
      // this.terminalLayout.serverNodes = this.$refs.serverTree.getCheckedNodes(true)
      // if (this.terminalLayout.serverNodes.length === 0) return
      // // 如果用户只打开一个终端则自动切换为单列模式
      // this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
      // if (this.terminalLayout.serverNodes.length === 1) {
      //   this.handleChangeLayout(1)
      //   this.$refs.terminalTools.setLayoutMode(1)
      // }
      // this.terminalTools.mode = 1
      // this.terminalLayout.uuid = this.$refs.serverTree.getUuid()
      // this.terminalLayout.terminals = []
      // for (const node of this.terminalLayout.serverNodes) {
      //   const serverNode = {
      //     ...node.server,
      //     instanceId: node.id,
      //     label: node.label
      //   }
      //   this.terminalLayout.terminals.push(serverNode)
      // }
      this.$nextTick(() => {
        // this.$refs.terminalLayout.open()
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
      if (this.terminalLayout.containers.length === 0) return
      this.terminalLayout.containers.forEach(container => {
          const args = {
            container: container,
            isNotify: false
          }
          this.$refs.terminalLayout.handleLogout(args)
        }
      )
      this.$message.warning('所有终端已关闭')
      this.recovery()
    },
    /**
     * container:
     * 单个终端退出
     * @param id
     */
    handleLogoutByContainer (container) {
      this.terminalLayout.containers = this.terminalLayout.containers.filter(function (n) {
        return n.instanceId !== container.container.instanceId
      })
      if (container.isNotify) this.$message.warning(container.container.instanceId + '终端已关闭')
      if (this.terminalLayout.containers.length === 0) {
        this.recovery()
        this.$refs.terminalLayout.close()
        this.$nextTick(() => {
          this.layout.status = 0
        })
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
