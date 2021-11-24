<template>
  <el-tag disable-transitions
          :style="{ backgroundColor: promptColorOptions.find(e=> e.value === env.promptColor).label }">
    <span :style="{color: util.colorReverse(env.color)}">
          {{ promptColorOptions.find(e => e.value === env.promptColor).label }}
    </span>
  </el-tag>
</template>

<script>

import util from '@/libs/util'
// fontColor: util.colorReverse(env.color)
export default {
  name: 'PromptColorTag',
  props: ['env', 'promptColorOptions'],
  data () {
    return {
      util: util
    }
  }
}
</script>

<style scoped>

</style>
