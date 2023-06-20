<!--suppress HtmlUnknownTag -->
<template>
  <span class="tag-group">
    <span v-for="item in accounts" :key="item.id">
        <el-tag size="mini" style="margin-left: 5px" :style="{ color: item.accountType === 0 ? '#67c23a' : '#F56C6C' }">
          <i class="fas fa-desktop" aria-hidden="true" v-show="item.protocol=== 'vnc'"/>
          <i class="fab fa-windows" aria-hidden="true" v-show="item.protocol=== 'rdp'"/>
           {{ item.username }}
          <span v-show="item.protocol=== 'ssh'">{{ item.accountType === 0 ? '$': '#'}}</span>
        </el-tag>
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
