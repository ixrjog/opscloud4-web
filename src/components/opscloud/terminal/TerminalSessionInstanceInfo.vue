<template>
  <el-card shadow="hover">
    <div>
      <el-tag :type="sessionInstance.instanceClosed ?  '':'success'">{{ sessionInstance.instanceId }}</el-tag>
    </div>
    <el-row :gutter="10">
      <el-col :span="20">
        <i class="far fa-clock"></i>{{ sessionInstance.openTime }}[{{ sessionInstance.sessionDuration }}s]
        <div>
          <i class="fas fa-video"></i>{{ util.bytesToSize(sessionInstance.outputSize) }}
          <i class="far fa-address-card"></i>{{ sessionInstance.loginUser }}
        </div>
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-button type="text" style="float: right; padding: 3px 0"
                     @click="handleCommand(sessionInstance)"><i class="fas fa-greater-than-equal"></i>Cmd
          </el-button>
        </el-row>
        <el-row>
          <el-button type="text" style="float: right; padding: 3px 0"
                     @click="handlePlay(sessionInstance)"><i class="fas fa-play"></i>Play
          </el-button>
        </el-row>
      </el-col>
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
        name: 'sys/audit/terminal/command', params: sessionInstance
      })
    },
    handlePlay (sessionInstance) {
      this.$router.push({
        // path: '/sys/audit/terminal/play?sessionId=' + sessionInstance.sessionId + '&instanceId=' + sessionInstance.instanceId
        name: 'sys/audit/terminal/play', params: sessionInstance
      })
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 5px;
  margin-right: 10px;
}

i {
  margin-right: 5px;
}

</style>
