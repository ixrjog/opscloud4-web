<template>
  <d2-container>
    <h1>会话播放</h1>
    <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
      <div slot="header" class="clearfix" style="height: 15px">
        <span><el-tag>{{ sessionInstance.instanceId }}</el-tag></span>
        <el-tooltip class="item" effect="light" content="关闭" placement="top-start">
          <el-button style="float: right; padding: 3px 0" type="text"
                     @click="handleClose">
            Close
          </el-button>
        </el-tooltip>
      </div>
      <terminal-item :terminalSetting="terminalSetting" :server="sessionInstance"
                     @sendMessage="sendMessage"
                     ref="terminal"
                     id="terminal"></terminal-item>
    </el-card>
  </d2-container>
</template>

<script>

import util from '@/libs/util'
import TerminalItem from '../../../../../components/opscloud/terminal/TerminalItem'
import { mapState } from 'vuex'
import TerminalState from '@/components/opscloud/common/enums/terminal.state.js'

const wsUrl = 'ws/terminal/session/audit'

const theme = {
  foreground: '#FFFFFF', // 字体
  background: '#606266', // 背景色
  cursor: 'help', // 设置光标
  red: '#dd7479',
  blue: '#1BD1FF'
}

export default {
  name: 'TerminalSessionAuditPlay',
  data () {
    return {
      util: util,
      socketURI: util.wsUrl(wsUrl),
      sessionInstance: {},
      terminalState: TerminalState,
      terminalSetting: { // 终端主题
        theme: theme,
        rows: 30
      }
    }
  },
  components: {
    TerminalItem
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mounted () {
    try {
      if( this.$route.params.sessionId === undefined || this.$route.params.instanceId === undefined ){
         return
      }
      this.initTerminalSetting()
      this.sessionInstance = {
        sessionId: this.$route.params.sessionId,
        instanceId: this.$route.params.instanceId
      }
      this.play()
    } catch (e) {
      this.sessionInstance = null
    }
  },
  methods: {
    /**
     * 设置终端主题色彩
     */
    initTerminalSetting () {
      if (typeof (this.info.terminalSetting) !== 'undefined') {
        this.terminalSetting = {
          ...this.info.terminalSetting
        }
      }
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
     * 播放
     */
    play () {
      if (this.sessionInstance === null) return
      setTimeout(() => {
        this.$refs.terminal.init()
      }, 500)
      setTimeout(() => {
        this.initSocket()
      }, 1000)
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
    handleClose () {
      const closeMessage = {
        state: this.terminalState.CLOSE
      }
      this.sendMessage(closeMessage)
      this.$refs.terminal.dispose()
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
          const playMessage = {
            // token: util.cookies.get('token'),
            ...this.sessionInstance,
            state: this.terminalState.PLAY
          }
          this.sendMessage(playMessage)
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
        if (this.$refs.terminal !== null) {
          try {
            this.$refs.terminal.write(messageJson.output)
          } catch (e) {
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
