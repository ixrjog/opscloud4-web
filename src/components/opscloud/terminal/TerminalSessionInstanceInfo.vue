<template>
  <el-card shadow="hover">
    <div>
      <el-tag size="mini" :type="sessionInstance.instanceClosed ?  '':'success'">
        {{ sessionInstance.instanceId }}
      </el-tag>
    </div>
    <el-row>
      <i class="far fa-clock"></i>{{ sessionInstance.openTime }}[{{ sessionInstance.sessionDuration }}s]
      <div>
        <i class="fas fa-video"></i>{{ util.bytesToSize(sessionInstance.outputSize) }}
        <i class="far fa-address-card"></i>{{ sessionInstance.loginUser }}
      </div>
    </el-row>
    <el-row style="float: right; padding: 3px 0">
      <span v-if="sessionInstance.commandSize !== 0">
        <el-badge :value="sessionInstance.commandSize" class="item" type="primary" style="font-size: 4px">
          <el-button type="text" style="float: right; padding: 3px 0" @click="handleCommand(sessionInstance)"><i class="fas fa-greater-than-equal"></i>CMD
          </el-button>
        </el-badge>
      </span>
      <el-button type="text" @click="handlePlay(sessionInstance)"><i class="fas fa-play"></i>Play
      </el-button>
    </el-row>
  </el-card>
</template>

<script>

import util from '@/libs/util'

export default {
  name: 'TerminalSessionInstanceInfo',
  props: ['sessionInstance'],
  data () {
    return {
      util: util
    }
  },
  methods: {
    handleCommand (sessionInstance) {
      this.$router.push({
        // path: '/sys/audit/terminal/play?sessionId=' + sessionInstance.sessionId + '&instanceId=' + sessionInstance.instanceId
        name: 'sys-audit-terminal-command', params: sessionInstance
      })
    },
    handlePlay (sessionInstance) {
      this.$router.push({
        // path: '/sys/audit/terminal/play?sessionId=' + sessionInstance.sessionId + '&instanceId=' + sessionInstance.instanceId
        name: 'sys-audit-terminal-play', params: sessionInstance
      })
    }
  }
}
</script>

<style scoped>

>>> .el-card__body {
  padding: 5px;
}

.el-card {
  margin-bottom: 5px;
  margin-right: 10px;
  min-width: 340px;
}

i {
  margin-right: 5px;
}

.el-button {
  margin-left: 15px;
}

</style>
