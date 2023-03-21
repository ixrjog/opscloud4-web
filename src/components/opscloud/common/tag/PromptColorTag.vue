<template>
<!--  <el-tag disable-transitions size="mini"-->
<!--          :style="{ backgroundColor: promptColorOptions.find(e=> e.value === env.promptColor).label }">-->
<!--    <i class="fas fa-square" :style="{color: util.colorReverse(env.color)}"></i>{{ promptColorOptions.find(e => e.value === env.promptColor).label }}-->
<!--  </el-tag>-->
  <el-tag disable-transitions size="mini">
    <i class="fas fa-square" :style="{color: promptColorOptions.find(e=> e.value === env.promptColor).label}"></i>
    <span style="margin-left: 2px">{{ promptColorOptions.find(e => e.value === env.promptColor).label }}</span>
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
