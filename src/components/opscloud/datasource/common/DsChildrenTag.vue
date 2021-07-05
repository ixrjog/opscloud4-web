<template>
  <span class="tag-group">
    <span v-for="child in children" :key="child.id">
        <el-tag v-if="type === 0">{{ child.assetId }}</el-tag>
        <el-tag v-if="type === 1">{{ child.assetId }}&lt;{{ child.name }}&gt;</el-tag>
        <div v-if="type === 2">
          <el-tag>{{ child.name }}&lt;{{ child.assetKey }}&gt;</el-tag>
        </div>
<<<<<<< HEAD
      <el-tag style="margin-left: 5px" v-if="type === 3">{{ child.name }}</el-tag>
      <el-tag style="margin-left: 5px" v-if="type === 4">{{ child.name }}&lt;{{ child.assetKey }}&gt;</el-tag>
=======
      <el-tag v-if="type === 3">{{ child.name }}</el-tag>
      <el-tag v-if="type === 4">{{ child.name }}&lt;{{ child.assetKey }}&gt;</el-tag>
>>>>>>> feature/xiuyuan
    </span>
  </span>
</template>

<script>
export default {
  name: 'DsChildrenTag',
  props: ['children', 'type']
}
</script>

<style scoped>
.el-tag {
  margin-left: 5px
}
</style>
