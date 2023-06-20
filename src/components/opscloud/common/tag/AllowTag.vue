<!--suppress HtmlUnknownTag -->
<template>
  <el-tag class="filters" :type="allow | getAllowType" size="mini">{{allow| getAllowText}}</el-tag>
</template>

<script>

export function getAllowType (value) {
  switch (value) {
    case true:
      return 'success'
    case false:
      return 'warning'
    default:
      return 'info'
  }
}

export function getAllowText (value) {
  switch (value) {
    case true:
      return '允许'
    case false:
      return '禁止'
    default:
      return '未定义'
  }
}

export default {
  name: 'AllowTag',
  props: ['allow'],
  filters: {
    getAllowType, getAllowText
  }
}
</script>

<style scoped>

</style>
