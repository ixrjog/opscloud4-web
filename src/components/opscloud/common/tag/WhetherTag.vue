<template>
  <el-tag size="mini" class="filters" :type="whether | getWhetherType">{{whether| getWhetherText}}</el-tag>
</template>

<script>

// Filters
import { getWhetherType, getWhetherText } from '@/filters/common/whether.js'

export default {
  name: 'WhetherTag',
  props: ['whether'],
  filters: {
    getWhetherType, getWhetherText
  }
}
</script>

<style scoped>

</style>
