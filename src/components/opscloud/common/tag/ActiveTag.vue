<template>
  <el-tag size="mini" disable-transitions :type="isActive ? 'success' : 'info'">{{ isActive ?
    '有效':'无效'}}
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
