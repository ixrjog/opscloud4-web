<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="80%" :before-close='handlerClose'>
    <slot></slot>
    <div v-for="s in servers" :key="s.name">
      <template>
        <el-col :span="24">
          <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
            <div slot="header" class="clearfix" style="height: 15px">
              <span><el-tag>{{ s.name }}</el-tag></span>
              <el-tooltip class="item" effect="light" content="退出" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text" @click="handlerLogout(s.name)">
                  <i class="fa fa-sign-out" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="DuplicateSession复制会话" placement="top-start">
                <el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
                           @click="handlerDuplicateSession()"><i class="fa fa-clone" aria-hidden="true"></i>
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
      <el-button size="mini" @click="handlerExit">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/libs/util'
import tools from '@/libs/tools'

// import { queryUserSettingByGroup } from '@api/user/user.setting.js'
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
  foreground: '#FFFFFF', // 字体
  background: '#606266', // 背景色
  cursor: 'help', // 设置光标
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
        theme: theme
      }
    }
  },
  name: 'TerminalMaster',
  props: ['formStatus'],
  mixins: [],
  components: {
    TerminalItem
  },
  mounted () {
    // this.initTerminalSetting()
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
    // initTerminalSetting () {
    //   queryUserSettingByGroup(settingGroup)
    //     .then(res => {
    //       if (res.success) {
    //         try {
    //           this.terminalSetting.theme.foreground = res.body.XTERM_FOREGROUND
    //           this.terminalSetting.theme.background = res.body.XTERM_BACKGROUND
    //           this.terminalSetting.rows = res.body.XTERM_ROWS || 30
    //         } catch (e) {
    //         }
    //       } else {
    //         this.$message.error(res.msg)
    //       }
    //     })
    // },
    handlerExit () {
      this.sendMessage(message.close)
      this.servers = []
      clearInterval(this.timer)
      this.formStatus.visible = false
    },
    open (server) {
      this.server = server
      this.servers.push(server)
      this.initTerminal(server)
      this.handlerLogin()
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
    /**
       * 发送空心跳 避免阿里云SLB会话断开
       */
    handlerHeartbeat () {
      try {
        this.sendMessage(message.heartbeat)
      } catch (e) {
      }
    },
    /**
       * 后端调整体型
       */
    handlerResize (server) {
      this.$refs[`terminal_${server.name}`][0].resize()
    },
    /**
       * 复制会话，重开一个终端（支持变更用户类型）
       * @param id
       */
    handlerDuplicateSession () {
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
    handlerLogout (name) {
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
      if (this.servers.length === 0) this.handlerExit()
    },
    handlerClose (done) {
      this.$confirm('确定退出Web终端,并关闭所有会话?')
        .then(_ => {
          done()
          this.handlerExit()
        })
        .catch(_ => {
        })
    },
    /**
       * 登录
       */
    handlerLogin () {
      this.initSocket()
      this.setTimer()
    },
    sendMessage (message) {
      this.socketOnSend(JSON.stringify(message))
    },
    sendCmd (server, command) {
      this.sendMessage(command)
      this.$refs[`terminal_${server.name}`][0].focus()
      // this.terminalMap[this.server.name].focus() // 强制焦点
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
          this.servers = []
          this.servers.push(this.server)
          this.$nextTick(() => { // 需要延迟执行
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
              this.handlerResize(this.server)
            })
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
