<template>
  <div>
    <div :id="id" class="xterm"></div>
  </div>
</template>

<script>

import util from '@/libs/util'

import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'


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
      term: null,
      id: util.uuid(),
      fitAddon: new FitAddon(),
      switch: true,
      theme: theme
    }
  },
  name: 'LogTerminal',
  props: [ 'step'],
  mixins: [],
  mounted () {
    this.init()
  },
  methods: {
    dispose () {
      try {
        this.term.dispose()
      } catch (e) {
      }
    },
    init () {
      // let log = this.switch ? this.step.log : this.step.displayDescription.replace(/ {24,50}/g, '\n').replace(/^(\t)*$\n/g, '')
      const log= this.step.log
      if (log === null || log === '') return
      let line = log.split('\n').length
      const rows = line > 30 ? 30 : line
      let term = new Terminal({
        rendererType: 'canvas', // 渲染类型
        allowTransparency: true,
        fontSize: 11,
        rows: rows,
        theme: this.theme,
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
      term.write(log)
      this.term = term
    },
    doSwitch () {
      this.switch = !this.switch
      if (this.term !== null) {
        this.term.clear()
        this.term.dispose()
        this.term = null
      }
      this.init()
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
