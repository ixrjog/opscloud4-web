<!--suppress HtmlUnknownTag -->
<template>
  <span class="tag-group">
    <span v-for="child in children" :key="child.id">
        <el-tag size="mini" v-if="type === 0">{{ child.assetId }}</el-tag>
        <el-tag size="mini" v-if="type === 1">{{ child.assetId }}&lt;{{ child.name }}&gt;</el-tag>
        <div v-if="type === 2">
          <el-tag size="mini">{{ child.name }}&lt;{{ child.assetKey }}&gt;</el-tag>
        </div>
        <el-tag size="mini" v-if="type === 3">{{ child.name }}</el-tag>
        <el-tag size="mini" v-if="type === 4">{{ child.name }}&lt;{{ child.assetKey }}&gt;</el-tag>
        <el-tag size="mini" v-if="type === 5">{{ child.assetKey }}</el-tag>
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
