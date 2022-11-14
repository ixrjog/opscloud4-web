<!--suppress JSUnresolvedVariable -->
<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="80%" :before-close='handleClose'>
    <slot></slot>
    <div v-for="s in servers" :key="s.name">
      <template>
        <el-col :span="24">
          <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
            <div slot="header" class="clearfix" style="height: 15px">
              <span>
                <el-tag size="mini">{{ s.name }}</el-tag>
              </span>
              <el-tooltip class="item" effect="light" content="退出" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleLogout(s.name)">
                  <i class="fas fa-sign-out" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="DuplicateSession复制会话" placement="top-start">
                <el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
                           @click="handleDuplicateSession()"><i class="fas fa-clone" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
            </div>
            <terminal-item :terminalSetting="terminalSetting" :server="s" @sendMessage="sendMessage"
                           :ref="`terminal_${s.name}`" :id="`${s.name}`"></terminal-item>
          </el-card>
        </el-col>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleExit">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/libs/util'
import tools from '@/libs/tools'

import { mapState } from 'vuex'
import TerminalItem from './TerminalItem'

const wsUrl = 'ws/terminal'
// const settingGroup = 'XTERM'

const message = {
  close: {
    status: 'CLOSE'
  },
  heartbeat: {
    status: 'HEARTBEAT'
  }
}

const theme = {
  // 字体色
  foreground: '#181818',
  // 背景色
  background: '#EEEEEE',
  /** The cursor color 设置光标 */
  cursor: 'help',
  /** The accent color of the cursor (used as the foreground color for a block cursor) */
  cursorAccent: '#838383',
  //selection: '#f10b15',
  red: '#dd7479',
  blue: '#1BD1FF'
}

export default {
  data () {
    return {
      title: '超级终端',
      socketURI: util.wsUrl(wsUrl),
      server: {}, // 原服务器
      servers: [], // 所有服务器列表
      timer: null, // 心跳定时器
      terminalSetting: { // 终端主题
        theme: theme,
        rows: 30
      }
    }
  },
  name: 'TerminalMaster',
  props: ['formStatus'],
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  mixins: [],
  components: {
    TerminalItem
  },
  mounted () {
    this.initTerminalSetting()
  },
  beforeDestroy () {
    try {
      this.socket.close()
    } catch (e) {
    }
    clearInterval(this.timer) // 销毁定时器
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
    handleExit () {
      this.sendMessage(message.close)
      this.servers = []
      clearInterval(this.timer)
      this.formStatus.visible = false
    },
    open (server) {
      this.server = server
      this.servers.push(server)
      this.initTerminal(server)
      this.handleLogin()
    },
    initTerminal (server) {
      this.$nextTick(() => {
        this.$refs[`terminal_${server.name}`][0].init()
      })
    },
    setTimer () {
      this.timer = setInterval(() => {
        this.handleHeartbeat()
        // console.log('开始定时...每10秒执行一次')
      }, 10000)
    },
    /**
     * 发送空心跳 避免阿里云SLB会话断开
     */
    handleHeartbeat () {
      try {
        this.sendMessage(message.heartbeat)
      } catch (e) {
      }
    },
    /**
     * 后端调整体型
     */
    handleResize (server) {
      this.$refs[`terminal_${server.name}`][0].resize()
    },
    /**
     * 复制会话，重开一个终端（支持变更用户类型）
     * @param id
     */
    handleDuplicateSession () {
      // 计算 instanceId  源id  server-prod-1#1
      const instanceId = this.server.name + '#' + tools.uuid()
      const sourceTerminal = this.$refs[`terminal_${this.server.name}`][0]
      const duplicateSessionMessage = {
        status: 'DUPLICATE_SESSION_IP',
        duplicateInstanceId: this.server.name,
        token: util.cookies.get('token'),
        instanceId: instanceId,
        xtermWidth: sourceTerminal.fitAddon._terminal.cols * 7,
        xtermHeight: document.getElementById(instanceId.split('#')[0]).clientHeight
      }
      const server = {
        name: instanceId,
        ip: this.server.privateIp
      }
      this.servers.push(server)
      this.$nextTick(() => {
        this.initTerminal(server)
        this.sendMessage(duplicateSessionMessage)
      })
    },
    /**
     * 单个终端退出
     * @param id
     */
    handleLogout (name) {
      const logoutMessage = {
        status: 'LOGOUT',
        instanceId: name
      }
      this.sendMessage(logoutMessage)
      this.$refs[`terminal_${name}`][0].logout()
      this.servers = this.servers.filter(function (s) {
        return s.name !== name
      })
      this.$message.warning(name + '终端已关闭')
      if (this.servers.length === 0) this.handleExit()
    },
    handleClose (done) {
      this.$confirm('确定退出Web终端,并关闭所有会话?')
        .then(_ => {
          done()
          this.handleExit()
        })
        .catch(_ => {
        })
    },
    /**
     * 登录
     */
    handleLogin () {
      this.initSocket()
      this.setTimer()
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
    sendCmd (server, command) {
      this.sendMessage(command)
      // 强制焦点
      this.$refs[`terminal_${server.name}`][0].focus()
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
        this.$message.error('用户Token失效, 请重新登录平台')
        return
      }
      // socket连接成功
      this.socket.onopen = () => {
        try {
          this.servers = []
          this.servers.push(this.server)
          // 延迟执行
          this.$nextTick(() => {
            const initMessage = {
              token: util.cookies.get('token'),
              instanceId: this.server.name,
              ip: this.server.privateIp,
              status: 'INITIAL_IP',
              terminal: {
                width: 0,
                height: 308
              }
            }
            this.sendMessage(initMessage)
            this.$nextTick(() => {
              this.handleResize(this.server)
            })
          })
        } catch (e) {
          this.$message.error('登录失败, 未选择服务器或其它原因')
        }
      }
    },
    socketOnClose () {
      this.socket.onclose = () => {
      }
    },
    socketOnError () {
      this.socket.onerror = () => {
        this.$message.error('服务端连接失败, WebSocket错误!')
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
          _this.$refs[`terminal_${n.instanceId}`][0].write(n.output)
        })
      }
    }
  }
}
</script>

<style>
.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
