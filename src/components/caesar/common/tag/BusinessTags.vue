<template>
  <span class="tag-group">
    <span v-for="item in tags" :key="item.id">
      <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
        <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
      </el-tooltip>
    </span>
  </span>
</template>

<script>
export default {
  name: 'BusinessTags',
  props: ['tags']
}
</script>

<style scoped>

</style>
