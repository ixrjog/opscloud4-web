<template>
  <d2-container>
    <h1>剧本任务日志</h1>
    <div v-for="s in serverTaskMembers" :key="s.instanceId">
      <template>
        <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
          <div slot="header" class="clearfix" style="height: 15px">
            <el-tag size="mini">{{ s.instanceId }}</el-tag>
            <env-tag style="margin-left: 5px" :env="s.env"></env-tag>
          </div>
          <terminal-item :terminalSetting="terminalSetting"
                         :server="s"
                         :ref="`terminal_${s.instanceId}`"
                         :id="`${s.instanceId}`"
                         @sendMessage="sendMessage">
          </terminal-item>
        </el-card>
      </template>
    </div>
  </d2-container>
</template>

<script>

import util from '@/libs/util'
import { mapState } from 'vuex'
import TerminalState from '@/components/opscloud/common/enums/terminal.state.js'
import TerminalItem from '../../../../components/opscloud/terminal/TerminalItem'
import EnvTag from '../../../../components/opscloud/common/tag/EnvTag'

const wsUrl = 'ws/server/task/play'

const theme = {
  foreground: '#FFFFFF', // 字体
  background: '#606266', // 背景色
  cursor: 'help', // 设置光标
  red: '#dd7479',
  blue: '#1BD1FF'
}

export default {
  name: 'ServerTaskPlay', // 剧本任务播放
  data () {
    return {
      util: util,
      socketURI: util.wsUrl(wsUrl),
      serverTaskMembers: [],
      terminalState: TerminalState,
      terminalSetting: { // 终端主题
        theme: theme,
        rows: 30
      }
    }
  },
  components: {
    TerminalItem,
    EnvTag
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mounted () {
    try {
      // 校验参数
      const serverTaskMembers = JSON.parse(this.$route.query.serverTaskMembers)
      if (serverTaskMembers === undefined || serverTaskMembers.length === 0) {
        return
      }
      this.initTerminalSetting()
      this.serverTaskMembers = serverTaskMembers
      this.play()
    } catch (e) {
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
      setTimeout(() => {
        this.serverTaskMembers.forEach(s => {
          this.$refs[`terminal_${s.serverName}`][0].init()
        })
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
            serverTaskMemberIds: this.serverTaskMembers.map(e => (e.id)),
            state: this.terminalState.PLAY
          }
          this.sendMessage(playMessage)
        } catch (e) {
          this.$message.error('登录失败，参数错误或其它原因')
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
        if (this.$refs[`terminal_${messageJson.instanceId}`] !== null) {
          try {
            if (messageJson.error !== '') {
              this.$refs[`terminal_${messageJson.instanceId}`][0].write(messageJson.error)
            }
            if (messageJson.output !== '') {
              this.$refs[`terminal_${messageJson.instanceId}`][0].write(messageJson.output)
            }
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
