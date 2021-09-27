<template>
  <el-tag class="filters" :type="taskStatus | getTaskStatusType" size="small">
    <i class="el-icon-loading" v-show="taskStatus === 'EXECUTING'"/>{{taskStatus| getTaskStatusText}}
  </el-tag>
</template>

<script>

export function getTaskStatusType (value) {
  switch (value) {
    case 'QUEUE':
      return 'info'
    case 'EXECUTING':
      return 'warning'
    case 'FINALIZED':
      return 'success'
    default:
      return 'info'
  }
}

export function getTaskStatusText (value) {
  switch (value) {
    case 'QUEUE':
      return '队列中'
    case 'EXECUTING':
      return '执行中'
    case 'FINALIZED':
      return '完成'
    default:
      return '未定义'
  }
}

export default {
  name: 'TaskStatusTag',
  props: ['taskStatus'],
  filters: {
    getTaskStatusType, getTaskStatusText
  }
}
</script>

<style scoped>

</style>
