<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <div v-show="show">
      <el-divider/>
      <el-row>
        <b class="outputTitle">Console stream</b>
        <i style="margin-left: 10px" class="el-icon-loading" v-if="streaming"/>
        <el-button type="text" @click="logout">
          <i class="far fa-times-circle"/>
        </el-button>
        <el-tooltip class="item" effect="light" content="适应窗体" placement="top-start">
          <el-button type="text" @click="fit">
            <i class="fas fa-arrows-alt"/>
          </el-button>
        </el-tooltip>
      </el-row>
      <div :id="id" class="xterm"/>
    </div>
  </div>
</template>

<script>

import util from '@/libs/util'

import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import WebSocketAPI from '@/components/opscloud/common/enums/websocket.api'
import TerminalSettings from '@/components/opscloud/common/enums/terminal.settings.js'

export default {
  name: 'terminal-with-console-stream',
  data () {
    return {
      title: 'Console stream',
      socketURI: util.wsUrl(WebSocketAPI.CONTINUOUS_DELIVERY_JENKINS_CONSOLE_STREAM),
      timer: null,
      show: false,
      term: null,
      id: util.uuid(),
      fitAddon: new FitAddon(),
      theme: TerminalSettings.theme,
      streaming: false
    }
  },
  props: ['buildId'],
  components: {},
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    dispose () {
      try {
        this.term.dispose()
      } catch (e) {
      }
    },
    initSocket () {
      this.socket = new WebSocket(this.socketURI)
      this.socketOnClose()
      this.socketOnOpen()
      this.socketOnError()
      this.socketOnMessage()
      // this.setTimers()
    },
    init () {
      if (this.show) return
      this.streaming = false
      this.show = true
      const rows = 39
      const term = new Terminal({
        rendererType: 'canvas', // 渲染类型
        allowTransparency: true,
        fontSize: 11,
        rows: rows,
        theme: TerminalSettings.theme,
        termName: 'xterm',
        visualBell: false,
        popOnBell: false,
        scrollback: 1000, // 最大滚动行数
        screenKeys: false,
        debug: false,
        cancelEvents: false,
        cursorStyle: 'underline', // 光标样式
        cursorBlink: false, // 光标闪烁
        convertEol: true // 启用时，光标将设置为下一行的开头
      })
      term.loadAddon(this.fitAddon)
      term.open(document.getElementById(this.id))
      this.fitAddon.fit() // 获取对象的高度和宽度
      term.focus() // 聚焦
      this.term = term
      this.initSocket()
    },
    fit () {
      this.fitAddon.fit()
    },
    /**
     * 聚焦
     */
    focus () {
      this.term.focus()
    },
    clear () {
      this.term.clear()
    },
    scrollToBottom () {
      // 滚动到底部
      this.term.scrollToBottom()
    },
    /**
     * 单个终端退出
     * @param id
     */
    logout () {
      this.show = false
      this.term.dispose()
      delete (this.term)
    },
    socketOnOpen () {
      this.socket.onopen = () => { // 链接成功后
        this.streaming = true
        try {
          this.$nextTick(() => { // 需要延迟执行
            const queryMessage = {
              messageType: 'QUERY_LEO_BUILD_CONSOLE_STREAM',
              token: util.cookies.get('token'),
              buildId: this.buildId
            }
            this.sendMessage(JSON.stringify(queryMessage))
          })
        } catch (e) {
        }
      }
    },
    sendMessage (message) {
      this.socketOnSend(message)
    },
    socketOnClose () {
      this.socket.onclose = () => {
        this.streaming = false
        if (this.socket !== null) {
          this.socket.close()
        }
      }
    },
    socketOnError () {
      this.socket.onerror = () => {
      }
    },
    socketOnSend (data) {
      this.socket.send(data)
    },
    socketOnMessage () {
      this.socket.onmessage = (message) => {
        if (this.term !== null) {
          /**
           * consoleStream = {
           *   buildId: 1,
           *   log: ''
           * }
           * @type {string}
           */
          const consoleStream = JSON.parse(message.data)
          try {
            this.term.write(consoleStream.body.log)
            this.fitAddon.fit()
          } catch (e) {
          }
        }
      }
    }
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 5px 0;
}

.outputTitle {
  color: #5b5d66;
  margin-left: 10px;
}

.el-button {
  float: right;
  padding: 3px 0;
  margin-right: 20px;
}

.xterm {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}

</style>
