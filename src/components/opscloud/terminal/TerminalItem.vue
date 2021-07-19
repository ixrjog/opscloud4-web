<template>
  <div :id="server.instanceId" class="xterm"></div>
</template>

<script>

import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import TerminalState from '@/components/opscloud/common/enums/terminal.state.js'

export default {
  data () {
    return {
      terminalState: TerminalState,
      term: null,
      fitAddon: new FitAddon(),
      isInitSize: false // 是否初始化窗体
    }
  },
  name: 'TerminalItem',
  props: ['server', 'terminalSetting'],
  mixins: [],
  mounted () {
  },
  methods: {
    dispose () {
      try {
        this.term.dispose()
      } catch (e) {
      }
    },
    // 子组件回调函数
    getFitAddon () {
      return this.fitAddon
    },
    init () {
      const term = new Terminal({
        rendererType: 'canvas', // 渲染类型
        allowTransparency: true,
        fontSize: 11,
        rows: this.terminalSetting.rows,
        theme: this.terminalSetting.theme,
        termName: 'xterm',
        visualBell: false,
        popOnBell: false,
        scrollback: 1000, // 最大滚动行数
        screenKeys: false,
        debug: false,
        cancelEvents: false,
        cursorStyle: 'underline', // 光标样式
        cursorBlink: true, // 光标闪烁
        convertEol: true // 启用时，光标将设置为下一行的开头
      })
      term.loadAddon(this.fitAddon)
      term.open(document.getElementById(this.server.instanceId))
      this.fitAddon.fit() // 获取对象的高度和宽度
      term.focus() // 聚焦
      const _this = this
      term.onData(function (cmd) {
        const command = {
          data: cmd,
          state: _this.terminalState.COMMAND,
          instanceId: _this.server.instanceId
        }
        _this.sendMessage(command)
      })
      this.term = term
    },
    sendMessage (message) {
      this.$emit('sendMessage', message)
    },
    /**
     * 后端调整体型
     */
    resize () {
      if (this.term === null) return
      // this.$nextTick(() => {
      // })
      const id = this.server.instanceId
      this.fitAddon.fit() // 获取对象的高度和宽度
      const resizeMessage = {
        state: this.terminalState.RESIZE,
        instanceId: id,
        terminal: {
          width: this.fitAddon._terminal.cols * 7, // 边界扣除
          height: document.getElementById(this.server.instanceId).clientHeight
        }
      }
      this.sendMessage(resizeMessage)
      // 滚动到底部
      this.scrollToBottom()
    },
    /**
     * 聚焦
     */
    focus () {
      if (this.term !== null) this.term.focus()
    },
    write (output) {
      if (this.term !== null) {
        this.term.write(output)
        if (!this.isInitSize) {
          this.resize()
          this.isInitSize = true
        }
      }
    },
    clear () {
      if (this.term !== null) this.term.clear()
    },
    scrollToBottom () {
      // 滚动到底部
      if (this.term !== null) this.term.scrollToBottom()
    },
    /**
     * 单个终端退出
     * @param id
     */
    logout () {
      this.term.dispose()
      delete (this.term)
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
