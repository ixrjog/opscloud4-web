<template>
  <el-tag size="mini" disable-transitions :type="monitorStatus | getServerMonitorStatusType">
    {{ monitorStatus  | getServerMonitorStatusText }}
  </el-tag>
</template>

<script>


import { getServerMonitorStatusType, getServerMonitorStatusText } from '@/filters/server.monitor.status'

export default {
  name: 'ServerMonitorStatus',
  props: ['monitorStatus'],
  filters: {
    getServerMonitorStatusType,
    getServerMonitorStatusText
  }
}
</script>

<style scoped>

</style>
