<template>
  <span class="tag-group">
    <span v-for="item in users" :key="item.id">
        <el-tag style="margin-left: 5px">{{ item.username }}<{{ item.name !== '' ? item.name + ':': '' }}{{ item.displayName }}></el-tag>
    </span>
  </span>
</template>

<script>
export default {
  name: 'UsersTag',
  props: ['users']
}
</script>

<style scoped>

</style>
