<template>
  <div>
    <el-row :gutter="2">
      <div v-for="server in terminals" :key="server.instanceId">
        <el-col :span="colSpan">
          <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
            <div slot="header" class="clearfix" style="height: 15px">
              <span>
                <el-tag size="mini">{{ server.label }}</el-tag>
              </span>
              <env-tag :env="server.env" class="env"></env-tag>
              <business-tags v-if="server.tags !== null" :tags="server.tags" style="margin-left: 10px"></business-tags>
              <el-button type="text" v-if="server.document !== null"
                         style="margin-left: 10px" plain size="mini"
                         @click="handleRead(server)"><i class="fab fa-dochub"></i>
              </el-button>
              <el-tooltip class="item" effect="light" content="登出" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="handleLogout( { server:server, isNotify: true})">
                  Logout
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="复制会话" placement="top-start">
                <el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
                           @click="handleDuplicateSession(server)">Duplicate
                </el-button>
              </el-tooltip>
            </div>
            <terminal-item :terminalSetting="terminalSetting" :server="server" @sendMessage="sendMessage"
                           :ref="`terminal_${server.instanceId}`" :id="`${server.instanceId}`"></terminal-item>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>

import util from '@/libs/util'
import tools from '@/libs/tools'
import TerminalItem from './TerminalItem'

import TerminalState from '@/components/opscloud/common/enums/terminal.state.js'
import EnvTag from '../common/tag/EnvTag'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'

const wsUrl = 'ws/terminal'

const message = {
  heartbeat: {
    state: 'HEARTBEAT'
  },
  close: {
    state: 'CLOSE'
  }
}

export default {
  name: 'TerminalLayout',
  props: ['terminalSetting', 'terminals', 'uuid', 'loginType', 'colSpan'],
  data () {
    return {
      terminalState: TerminalState,
      socketURI: util.wsUrl(wsUrl),
      socket: null,
      timer: null // 心跳定时器
    }
  },
  components: {
    TerminalItem,
    BusinessTags,
    EnvTag
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    open () {
      for (const server of this.terminals) {
        this.initTerminal(server)
      }
      this.handleLogin()
    },
    openServer (server) {
      this.initTerminal(server)
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
    initTerminal (server) {
      this.$nextTick(() => {
        this.$refs[`terminal_${server.instanceId}`][0].init()
      })
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
    handleRead (args) {
      this.$emit('handleRead', args)
    },
    handleLogout (args) {
      const logoutMessage = {
        state: this.terminalState.LOGOUT,
        instanceId: args.server.instanceId
      }
      this.sendMessage(logoutMessage)
      this.$refs[`terminal_${args.server.instanceId}`][0].dispose()
      this.$emit('handleLogoutByServerNode', args)
    },
    /**
     * 复制会话，重开一个终端（支持变更用户类型）
     * @param id
     */
    handleDuplicateSession (serverNode) {
      const fitAddon = this.$refs[`terminal_${serverNode.instanceId}`][0].getFitAddon()
      const newServerNode = Object.assign({}, serverNode)
      // 计算 instanceId  源id  server-prod-1#1
      newServerNode.instanceId = tools.instanceId(serverNode.instanceId)
      const duplicateSessionMessage = {
        state: this.terminalState.DUPLICATE_SESSION,
        // duplicateInstanceId: id,
        // 源会话
        duplicateServerNode: serverNode,
        // 目标会话
        serverNode: newServerNode,
        token: util.cookies.get('token'),
        loginType: this.loginType,
        terminal: {
          width: fitAddon._terminal.cols * 7,
          height: document.getElementById(serverNode.instanceId).clientHeight
        }
      }
      this.$emit('handleLoginByServerNode', newServerNode)
      this.$nextTick(() => {
        this.sendMessage(duplicateSessionMessage)
      })
    },
    handleBatch (isBatch) {
      const batchCommandMessage = {
        state: this.terminalState.BATCH_COMMAND,
        isBatch: isBatch
      }
      this.sendMessage(batchCommandMessage)
    },
    handleResize () {
      for (const server of this.terminals) {
        this.handleResizeByServer(server)
      }
    },
    handleResizeByServer (server) {
      this.$nextTick(() => {
        this.$refs[`terminal_${server.instanceId}`][0].resize()
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
      this.socket.onopen = () => { // 链接成功后
        try {
          const initMessage = {
            token: util.cookies.get('token'),
            loginType: this.loginType,
            serverNodes: this.terminals,
            state: this.terminalState.LOGIN,
            terminal: {
              width: 0,
              height: 308
            }
          }
          this.sendMessage(initMessage)
        } catch (e) {
          this.$message.error('登录失败，未选择服务器或其它原因')
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
