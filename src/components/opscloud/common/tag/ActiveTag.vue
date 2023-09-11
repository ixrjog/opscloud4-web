<!--suppress HtmlUnknownTag -->
<template>
  <el-tag size="mini" disable-transitions :type="isActive ? 'success' : 'info'">
    {{ isActive ? $t('common.activeOptions.active') : $t('common.activeOptions.inactive') }}
  </el-tag>
</template>

<script>
export default {
  name: 'ActiveTag',
  props: ['isActive']
}
</script>

<style scoped>

</style>
