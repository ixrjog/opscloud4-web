<!--suppress HtmlUnknownTag -->
<template>
  <el-tag disable-transitions size="mini">
    <i class="fas fa-square" :style="{color: promptColorOptions.find(e=> e.value === env.promptColor).label}"/>
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
