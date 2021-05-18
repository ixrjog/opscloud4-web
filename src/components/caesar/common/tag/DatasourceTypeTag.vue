<template>
  <el-tag class="filters" size="small">{{ dsType| getDatasourceTypeText }}</el-tag>
</template>

<script>

// Filters
import { getDatasourceTypeText } from '@/filters/datasource.type.js'

export default {
  name: 'DatasourceTypeTag',
  props: ['dsType'],
  filters: {
    getDatasourceTypeText
  }
}
</script>

<style scoped>

</style>
