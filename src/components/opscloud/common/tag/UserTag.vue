<template>
  <div>
    <el-tag>
      {{ user.username }}&lt;{{ (user.name !== null && user.name !== '') ? user.name + ':' : '' }}{{ user.displayName }}&gt;
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'UserTag',
  props: ['user']
}
</script>

<style scoped>

</style>
