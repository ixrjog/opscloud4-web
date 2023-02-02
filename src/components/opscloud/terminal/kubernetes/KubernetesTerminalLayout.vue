<template>
  <div>
    <el-row :gutter="2">
      <div v-for="container in containers" :key="container.instanceId">
        <el-col :span="colSpan">
          <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
            <div slot="header" class="clearfix" style="height: 15px">
              <span>
                <el-tag size="mini">{{container.podIp}}</el-tag>
                <el-tag size="mini" style="margin-left: 5px">{{ container.instanceId }}</el-tag>
              </span>
              <!--              <env-tag :env="server.env" class="env"></env-tag>-->
              <el-tooltip class="item" effect="light" content="登出" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="handleLogout( {container:container,isNotify:true})">
                  Logout
                </el-button>
              </el-tooltip>
            </div>
            <kubernetes-terminal-item :terminalSettings="terminalSettings" :container="container"
                                      @sendMessage="sendMessage"
                                      :ref="`terminal_${container.instanceId}`"
                                      :id="`${container.instanceId}`"></kubernetes-terminal-item>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>

import util from '@/libs/util'
import TerminalState from '@/components/opscloud/common/enums/terminal.state.js'
import KubernetesTerminalItem from './KubernetesTerminalItem'

const wsUrl = 'ws/kubernetes/terminal'

const message = {
  heartbeat: {
    state: 'HEARTBEAT'
  },
  close: {
    state: 'CLOSE'
  }
}

export default {
  name: 'KubernetesTerminalLayout',
  props: ['terminalSettings', 'containers', 'loginParam', 'colSpan'],
  data () {
    return {
      terminalState: TerminalState,
      socketURI: util.wsUrl(wsUrl),
      socket: null,
      timer: null // 心跳定时器
    }
  },
  components: {
    KubernetesTerminalItem
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    open () {
      this.$nextTick(() => {
        this.containers.forEach(container => this.initTerminal(container))
        this.handleLogin()
      })
    },
    close () {
      this.sendMessage(message.close)
      /**
       *
       0        CONNECTING        连接尚未建立
       1        OPEN              WebSocket的链接已经建立
       2        CLOSING           连接正在关闭
       3        CLOSED            连接已经关闭或不可用
       */
      try {
        if (this.socket.readyState !== 3) this.socket.close()
      } catch (e) {
      }
      this.socket = null
      clearInterval(this.timer)
    },
    /**
     * 登录
     */
    handleLogin () {
      this.initSocket()
      this.setTimer()
    },
    initTerminal (container) {
      this.$refs[`terminal_${container.instanceId}`][0].init()
    },
    setTimer () {
      this.timer = setInterval(() => {
        this.handleHeartbeat()
        // console.log('开始定时...每10秒执行一次')
      }, 10000)
    },
    handleHeartbeat () {
      try {
        this.sendMessage(message.heartbeat)
      } catch (e) {
      }
    },
    /**
     * handleLogoutByInstance
     * {
     * server : {},
     * isNotify : boolean
     * }
     * 单个终端退出
     * @param id
     */
    handleLogout (args) {
      const logoutMessage = {
        state: this.terminalState.LOGOUT,
        instanceId: args.container.instanceId
      }
      this.sendMessage(logoutMessage)
      this.$refs[`terminal_${args.container.instanceId}`][0].dispose()
      this.$emit('handleLogoutByContainer', args)
    },
    handleBatch (isBatch) {
      const batchCommandMessage = {
        state: this.terminalState.BATCH_COMMAND,
        isBatch: isBatch
      }
      this.sendMessage(batchCommandMessage)
    },
    handleResize () {
      for (const container of this.containers) {
        this.handleResizeByContainer(container)
      }
    },
    handleResizeByContainer (container) {
      this.$nextTick(() => {
        this.$refs[`terminal_${container.instanceId}`][0].resize()
      })
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
    /**
     * WS初始化
     */
    initSocket () {
      this.socket = new WebSocket(this.socketURI)
      this.socketOnClose()
      this.socketOnOpen()
      this.socketOnError()
      this.socketOnMessage()
    },
    socketOnOpen () {
      if (util.cookies.get('token') === undefined && util.cookies.get('token') === null && util.cookies.get('token') === '') {
        this.$message.error('用户Token失效: 请重新登录平台')
        return
      }
      this.socket.onopen = () => { // 链接成功后
        try {
          const loginMessage = {
            ...this.loginParam,
            token: util.cookies.get('token'),
            state: this.terminalState.LOGIN,
            terminal: {
              width: 0,
              height: 308
            }
          }
          this.sendMessage(loginMessage)
        } catch (e) {
          this.$message.error('登录失败，未选择容器或其它原因')
        }
      }
    },
    socketOnClose () {
      this.socket.onclose = () => {
      }
    },
    socketOnError () {
      this.socket.onerror = () => {
        // console.log('socket 链接失败')
      }
    },
    socketOnSend (data) {
      try {
        this.socket.send(data)
      } catch (e) {
      }
    },
    socketOnMessage () {
      this.socket.onmessage = (message) => {
        const messageJson = JSON.parse(message.data)
        const _this = this
        messageJson.map(function (n) {
          if (_this.$refs[`terminal_${n.instanceId}`] !== null) {
            try {
              _this.$refs[`terminal_${n.instanceId}`][0].write(n.output)
            } catch (e) {
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.env {
  margin-left: 5px;
}

</style>
