<template>
  <span class="tag-group">
    <span v-for="item in accounts" :key="item.id">
        <el-tag style="margin-left: 5px" :style="{ color: item.accountType ===0 ? 'green' : 'red' }">
          <i class="fa fa-desktop" aria-hidden="true" v-show="item.protocol=== 'vnc'"></i>
          <i class="fa fa-terminal" aria-hidden="true" v-show="item.protocol=== 'ssh'"></i>
          <i class="fa fa-windows" aria-hidden="true" v-show="item.protocol=== 'rdp'"></i>
          {{ item.username }}</el-tag>
    </span>
  </span>
</template>

<script>
export default {
  name: 'AccountTags',
  props: ['accounts']
}
</script>

<style scoped>

</style>
