<template>
  <span class="tag-group">
    <span v-for="item in roles" :key="item.id">
      <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
        <el-tag size="mini" style="margin-left: 5px">{{ item.roleName }}</el-tag>
      </el-tooltip>
    </span>
  </span>
</template>

<script>
export default {
  name: 'RoleTags',
  props: ['roles']
}
</script>

<style scoped>

</style>
