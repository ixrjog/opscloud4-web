<template>
  <div>
    <span style="float: left">{{ name }}</span>
    <span :style="{float: 'right', color: '#8492a6', fontSize: '13px',marginLeft: '15px'}">{{ comment }}</span>
  </div>
</template>

<script>
export default {
  name: 'SelectItem',
  props: ['name', 'comment']
}
</script>

<style scoped>

</style>
