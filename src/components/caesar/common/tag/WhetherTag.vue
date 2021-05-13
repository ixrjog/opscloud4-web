<template>
  <el-tag class="filters" :type="whether | getWhetherType" size="small">{{whether| getWhetherText}}</el-tag>
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
