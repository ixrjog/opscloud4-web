<template>
  <el-tag size="mini" disable-transitions>{{ sessionType | getSessionTypeText }}
  </el-tag>
</template>

<script>

// Filters
import { getSessionTypeText } from '@/filters/terminal.session.js'

export default {
  name: 'SessionTypeTag',
  props: ['sessionType'],
  filters: {
    getSessionTypeText
  }
}
</script>

<style scoped>

</style>
