<template>
  <span class="tag-group">
    <span v-for="item in users" :key="item.id">
        <el-tag style="margin-left: 5px">
          {{ item.username }}&lt;{{ item.name !== null && item.name !== ''  ? item.name + ':' : '' }}{{ item.displayName }}&gt;
        </el-tag>
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
