<template>
  <div>
    <el-row :gutter="2">
      <div v-for="server in servers" :key="server.name">
        <el-col :span="colSpan">
          <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
            <div slot="header" class="clearfix" style="height: 15px">
              <span><el-tag>{{ server.name }}</el-tag></span>
              <el-tooltip class="item" effect="light" content="退出" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="handlerLogoutByInstance( {id:server.name,isNotify:true})">
                  Logout
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="复制会话" placement="top-start">
                <el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
                           @click="handlerDuplicateSessionByInstanceId(server.name)">Duplicate
                </el-button>
              </el-tooltip>
            </div>
            <terminal-item :terminalSetting="terminalSetting" :server="server" @sendMessage="sendMessage"
                           :ref="`terminal_${server.name}`" :id="`${server.name}`"></terminal-item>
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

import TerminalState from '@/components/caesar/common/enums/terminal.state.js'

const wsUrl = 'ws/terminal'

const message = {
  heartbeat: {
    status: 'HEARTBEAT'
  },
  close: {
    status: 'CLOSE'
  }
}

export default {
  name: 'TerminalLayout',
  props: ['terminalSetting', 'servers', 'instanceIds', 'uuid', 'loginType', 'colSpan'],
  data () {
    return {
      terminalState: TerminalState,
      socketURI: util.wsUrl(wsUrl),
      socket: null,
      timer: null // 心跳定时器
    }
  },
  components: {
    TerminalItem
  },
  beforeDestroy () {
  },
  methods: {
    open () {
      for (const server of this.servers) {
        this.initTerminal(server)
      }
      this.handlerLogin()
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
      if (this.socket.readyState !== 3) {
        try {
          this.socket.close()
        } catch (e) {
        }
        this.socket = null
      }
      clearInterval(this.timer)
    },
    /**
       * 登录
       */
    handlerLogin () {
      this.initSocket()
      this.setTimer()
    },
    initTerminal (server) {
      this.$nextTick(() => {
        this.$refs[`terminal_${server.name}`][0].init()
      })
    },
    setTimer () {
      this.timer = setInterval(() => {
        this.handlerHeartbeat()
        // console.log('开始定时...每10秒执行一次')
      }, 10000)
    },
    handlerHeartbeat () {
      try {
        this.sendMessage(message.heartbeat)
      } catch (e) {
      }
    },
    /**
       * 单个终端退出
       * @param id
       */
    handlerLogoutByInstance (args) {
      const logoutMessage = {
        state: this.terminalState.LOGOUT,
        instanceId: args.id
      }
      this.sendMessage(logoutMessage)
      this.$refs[`terminal_${args.id}`][0].dispose()
      this.$emit('handlerLogoutByInstance', args)
    },
    /**
       * 复制会话，重开一个终端（支持变更用户类型）
       * @param id
       */
    handlerDuplicateSessionByInstanceId (id) {
      // 计算 instanceId  源id  server-prod-1#1
      const instanceId = tools.instanceId(id)
      const fitAddon = this.$refs[`terminal_${id}`][0].getFitAddon()
      const duplicateSessionMessage = {
        state: this.terminalState.DUPLICATE_SESSION,
        duplicateInstanceId: id,
        token: util.cookies.get('token'),
        loginType: this.loginType,
        instanceId: instanceId,
        terminal: {
          width: fitAddon._terminal.cols * 7,
          height: document.getElementById(id).clientHeight
        }
      }
      this.$emit('handlerLoginByInstanceId', instanceId)
      this.$nextTick(() => {
        this.sendMessage(duplicateSessionMessage)
      })
    },
    handlerBatch (isBatch) {
      const batchCommandMessage = {
        state: this.terminalState.BATCH_COMMAND,
        isBatch: isBatch
      }
      this.sendMessage(batchCommandMessage)
    },
    handlerResize () {
      for (const server of this.servers) {
        this.handlerResizeByServer(server)
      }
    },
    handlerResizeByServer (server) {
      this.$refs[`terminal_${server.name}`][0].resize()
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
          this.$nextTick(() => {
            const initMessage = {
              uuid: this.uuid,
              token: util.cookies.get('token'),
              loginType: this.loginType,
              instanceIds: this.instanceIds,
              state: this.terminalState.LOGIN,
              terminal: {
                width: 0,
                height: 308
              }
            }
            this.sendMessage(initMessage)
          })
          this.$nextTick(() => {
            this.handlerResize()
          })
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
      this.socket.send(data)
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

</style>
