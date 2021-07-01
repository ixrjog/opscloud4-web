<template>
  <el-tag disable-transitions :type="serverStatus | getServerStatusType">{{serverStatus | getServerStatusText}}
  </el-tag>
</template>

<script>

// Filters
import { getServerStatusType, getServerStatusText } from '@/filters/server.status.js'

export default {
  name: 'ServerStatusTag',
  props: ['serverStatus'],
  filters: {
    getServerStatusType,
    getServerStatusText
  }
}
</script>

<style scoped>

</style>
