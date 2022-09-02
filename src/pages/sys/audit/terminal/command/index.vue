<template>
  <d2-container>
    <template>
      <div>
        <h1>{{ title }}</h1>
      </div>
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model="queryParam.queryName" clearable placeholder="查询命令" class="search-input"/>
        <el-button @click="fetchData" class="search-button">查询</el-button>
      </el-row>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
        <el-table-column prop="input" label="输入/输出">
          <template slot-scope="scope">
            <div :id="`terminal_input_${scope.row.id}`" class="xterm"></div>
            <div :id="`terminal_output_${scope.row.id}`" class="xterm"></div>
          </template>
        </el-table-column>
        <el-table-column prop="output" label="输出" v-if="false">
          <template slot-scope="scope">
            <div :id="`terminal_output_${scope.row.id}`" class="xterm"></div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                  @handleSizeChange="handleSizeChange"></pagination>
    </template>
  </d2-container>
</template>

<script>

// API
import { QUERY_TERMINAL_SESSION_INSTANCE_COMMAND_PAGE } from '@/api/modules/terminal/terminal.session.api.js'
import Pagination from '../../../../../components/opscloud/common/page/Pagination'

import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

const theme = {
  foreground: '#f3f3f3',
  background: '#535353',
  cursor: '#ffffff',
  selection: 'rgba(255, 255, 255, 0.3)',
  black: '#000000',
  red: '#e06c75',
  brightRed: '#e06c75',
  green: '#A4EFA1',
  brightGreen: '#A4EFA1',
  brightYellow: '#EDDC96',
  yellow: '#EDDC96',
  magenta: '#e39ef7',
  brightMagenta: '#e39ef7',
  cyan: '#5fcbd8',
  brightBlue: '#5fcbd8',
  brightCyan: '#5fcbd8',
  blue: '#5fcbd8',
  white: '#d0d0d0',
  brightBlack: '#808080',
  brightWhite: '#ffffff'
}

export default {
  data () {
    return {
      title: '终端命令审计',
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      queryParam: {
        queryName: '',
        extend: true
      },
      sessionInstance: null,
      terminalSetting: { // 终端主题
        theme: theme,
        rows: 30
      },
      display: {
        inputTerminals: [],
        outputTerminals: []
      }
    }
  },
  components: {
    Pagination
  },
  computed: {},
  mounted () {
    try {
      if (this.$route.params.sessionId === undefined || this.$route.params.id === undefined) {
        this.sessionInstance = null
        return
      }
      this.sessionInstance = {
        sessionId: this.$route.params.sessionId,
        id: this.$route.params.id
      }
      this.fetchData()
    } catch (e) {
      this.sessionInstance = null
    }
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    renderData () {
      this.$nextTick(() => {
        this.table.data.forEach(row => {
          const termInput = new Terminal({
            // 渲染类型 https://xtermjs.org/docs/api/terminal/modules/xterm/#renderertype
            // canvas dom
            rendererType: 'canvas',
            allowTransparency: true,
            fontSize: 11,
            rows: 2,
            // cols: 40,
            theme: this.terminalSetting.theme,
            termName: 'xterm',
            visualBell: false,
            popOnBell: false,
            scrollback: 2, // 最大滚动行数
            screenKeys: false,
            // cursor: 'help', // 设置光标
            debug: false,
            cancelEvents: false,
            convertEol: true // 启用时，光标将设置为下一行的开头
          })
          const inputFitAddon = new FitAddon()
          termInput.loadAddon(inputFitAddon)
          termInput.open(document.getElementById(`terminal_input_${row.id}`))
          inputFitAddon.fit() // 获取对象的高度和宽度
          termInput.write(row.prompt + ' ' + row.input)

          const termOutput = new Terminal({
            rendererType: 'canvas', // 渲染类型
            allowTransparency: true,
            fontSize: 11,
            rows: row.outputRows,
            theme: this.terminalSetting.theme,
            termName: 'xterm',
            visualBell: false,
            popOnBell: false,
            scrollback: 20, // 最大滚动行数
            screenKeys: false,
            debug: false,
            cancelEvents: false,
            convertEol: true // 启用时，光标将设置为下一行的开头
          })
          const outputFitAddon = new FitAddon()
          termOutput.loadAddon(outputFitAddon)
          termOutput.open(document.getElementById(`terminal_output_${row.id}`))
          outputFitAddon.fit() // 获取对象的高度和宽度
          termOutput.write(row.output)
          this.display.inputTerminals.push(termInput)
          this.display.outputTerminals.push(termOutput)
        })
      })
    },
    clearTerminals () {
      this.display.inputTerminals.forEach(e => {
        e.dispose()
      })
      this.display.outputTerminals.forEach(e => {
        e.dispose()
      })
      this.display.inputTerminals = []
      this.display.outputTerminals = []
    },
    fetchData () {
      if (this.sessionInstance === null) return
      this.table.loading = true
      this.clearTerminals()
      const requestBody = {
        terminalSessionInstanceId: this.sessionInstance.id,
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_TERMINAL_SESSION_INSTANCE_COMMAND_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.renderData()
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>

.search-input {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.search-button {
  margin-left: 5px;
}

>>>.el-table td div  {
  border-radius: 2px
}

</style>
