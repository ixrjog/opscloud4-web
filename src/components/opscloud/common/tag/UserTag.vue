<template>
    <el-tag size="small">
      {{ user.username }}&lt;{{ (user.name !== null && user.name !== '') ? user.name + ':' : '' }}{{ user.displayName }}&gt;
    </el-tag>
</template>

<script>
export default {
  name: 'UserTag',
  props: ['user']
}
</script>

<style scoped>

</style>
