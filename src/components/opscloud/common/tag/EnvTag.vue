<template>
  <el-tag disable-transitions :style="{ color: env.color }">{{env.envName}}</el-tag>
</template>

<script>
export default {
  name: 'EnvTag',
  props: ['env']
}
</script>

<style scoped>

</style>
