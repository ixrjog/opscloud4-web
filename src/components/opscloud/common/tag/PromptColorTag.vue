<template>
  <el-tag disable-transitions
          :style="{ backgroundColor: promptColorOptions.find(e=> e.value === env.promptColor).label }">
    {{ promptColorOptions.find(e=> e.value === env.promptColor).label }}
  </el-tag>
</template>

<script>
export default {
  name: 'PromptColorTag',
  props: ['env', 'promptColorOptions']
}
</script>

<style scoped>

</style>
