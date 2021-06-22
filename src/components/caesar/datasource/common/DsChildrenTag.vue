<template>
  <span class="tag-group">
    <span v-for="child in children" :key="child.id">
        <el-tag style="margin-left: 5px" v-if="type === 0">{{ child.assetId }}</el-tag>
        <el-tag style="margin-left: 5px" v-if="type === 1">{{ child.assetId }}<{{ child.name }}></el-tag>
        <div v-if="type === 2">
          <el-tag style="margin-left: 5px">{{ child.name }}<{{ child.assetKey }}></el-tag>
        </div>
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

</style>
