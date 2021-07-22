<template>
  <d2-container>
      <h1>{{title}}</h1>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="终端" name="terminal">
          <terminal-session-table></terminal-session-table>
        </el-tab-pane>
      </el-tabs>
  </d2-container>
</template>

<script>

import TerminalSessionTable from '../../../components/opscloud/audit/TerminalSessionTable'

export default {
  data () {
    return {
      title: '审计管理',
      activeName: 'terminal'
    }
  },
  components: {
    TerminalSessionTable
  },
  computed: {},
  mounted () {
    // this.fetchData()
  },
  methods: {
    handleClick () {

    }
  }
}
</script>

<style scoped>
  .input-bar {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .button {
    margin-left: 5px;
  }
</style>
