<!--suppress HtmlUnknownTag -->
<template>
  <el-tag disable-transitions size="mini" :style="{ backgroundColor: item.label }">
    {{ item.label }}
  </el-tag>
</template>

<script>
export default {
  name: 'SelectPromptColorTag',
  props: ['item', 'promptColorOptions']
}
</script>

<style scoped>

</style>
