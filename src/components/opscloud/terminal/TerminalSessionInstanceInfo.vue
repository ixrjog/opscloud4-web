<template>
  <el-card shadow="hover">
    <div>
      <el-tag>{{sessionInstance.instanceId}}</el-tag>
    </div>
    <div>
      <i class="far fa-clock"></i>{{ sessionInstance.openTime }}[{{sessionInstance.sessionDuration}}s]
      <el-tag type="success" v-if="!sessionInstance.instanceClosed">会话开启</el-tag>
      <el-tag type="info" v-if="sessionInstance.instanceClosed">会话关闭</el-tag>
      <div>
        <i class="fas fa-video"></i>{{ util.bytesToSize(sessionInstance.outputSize) }}
        <i class="far fa-address-card"></i>{{ sessionInstance.loginUser }}
        <el-button type="text" style="float: right; padding: 3px 0" @click="handlePlay(sessionInstance)"><i
          class="fas fa-play"></i>回放
        </el-button>
      </div>
    </div>
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
    handlePlay (sessionInstance) {
      this.$router.push({
        // path: '/sys/audit/terminal/play?sessionId=' + sessionInstance.sessionId + '&instanceId=' + sessionInstance.instanceId
        name: 'sys/audit/terminal/play', params:  sessionInstance
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
