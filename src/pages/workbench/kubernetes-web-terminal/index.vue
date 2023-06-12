<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <div v-show="layout.status === 0" v-if="false">
      <h1>{{ title }}</h1>
    </div>
    <!--      应用选择器-->
    <application-kubernetes-selector v-show="layout.status === 0"
                                     @handleOpen="handleOpen"/>
    <el-row v-if="layout.status === 0" style="margin-top: 10px">
      <document-zone mount-zone="KUBERNETES"/>
    </el-row>
    <el-row>
    </el-row>
    <el-tooltip class="item" effect="light" content="任意窗口输入指令同步到所有终端" placement="bottom">
      <el-button @click="handleChangeBatch"
                 v-if="this.layout.status === 1 && terminalLayout.loginParam.sessionType === 'CONTAINER_TERMINAL'"
                 :type="terminalTools.batchType" plain>命令同步
      </el-button>
    </el-tooltip>
    <el-row>
      <!--          终端布局-->
      <kubernetes-terminal-layout class="terminal-layout" ref="terminalLayout"
                                  :loginParam="terminalLayout.loginParam"
                                  :terminalSettings="terminalSettings"
                                  :containers="terminalLayout.containers"
                                  :colSpan="terminalLayout.colSpan"
                                  @handleLogoutByContainer="handleLogoutByContainer"
                                  @handleRead="handleRead"/>
    </el-row>
    <business-doc-reader :form-status="formStatus.businessDoc" ref="businessDocReader"/>
  </d2-container>
</template>

<script>

import { mapState } from 'vuex'
import ApplicationKubernetesSelector
  from '../../../components/opscloud/terminal/kubernetes/ApplicationKubernetesSelector'
import KubernetesTerminalLayout from '../../../components/opscloud/terminal/kubernetes/KubernetesTerminalLayout'
import BusinessDocReader from '@/components/opscloud/business/BusinessDocReader'

import TerminalSettings from '@/components/opscloud/common/enums/terminal.settings.js'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  name: 'kubernetes-web-terminal',
  props: {},
  data () {
    return {
      title: '容器管理',
      layout: {
        mode: 0,
        /**
         * 0 选择
         * 1 登录
         */
        status: 0
      },
      terminalSettings: {},
      terminalTools: {
        /**
         * 0未登录
         * 1登录
         */
        mode: 0,
        batchType: ''
      },
      terminalLayout: {
        loginParam: '',
        containers: [],
        colSpan: 24
      },
      formStatus: {
        businessDoc: {
          visible: false,
          title: '应用文档'
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
    ApplicationKubernetesSelector,
    KubernetesTerminalLayout,
    BusinessDocReader,
    DocumentZone
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
    handleOpen (loginParam) {
      this.layout.status = 1
      this.terminalTools.batchType = ''
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
      this.terminalLayout.loginParam = loginParam
      // 转换容器终端数据
      const containers = []
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
      })
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

.terminal-layout {
  margin-top: 5px;
}

</style>
