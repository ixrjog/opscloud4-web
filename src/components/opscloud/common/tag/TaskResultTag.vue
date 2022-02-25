<template>
  <el-tag v-if="taskResult !== null && taskResult !== ''" class="filters" :type="taskResult | getTaskResultType"
          size="mini">
    {{ taskResult | getTaskResultText }}
  </el-tag>
</template>

<script>

export function getTaskResultType (value) {
  switch (value) {
    case 'SUCCESSFUL':
      return 'success'
    case 'FAILED':
      return 'danger'
    case 'ERROR':
      return 'danger'
    default:
      return 'info'
  }
}

export function getTaskResultText (value) {
  switch (value) {
    case 'SUCCESSFUL':
      return 'successful'
    case 'FAILED':
      return 'failed'
    case 'ERROR':
      return 'error'
    default:
      return '?'
  }
}

export default {
  name: 'TaskResultTag',
  props: ['taskResult'],
  filters: {
    getTaskResultType, getTaskResultText
  }
}
</script>

<style scoped>

</style>
