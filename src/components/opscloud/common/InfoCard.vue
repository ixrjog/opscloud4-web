<template>
  <div>
    <el-card shadow="hover">
      <div>
        <span style="color: #9d9fa3">{{ title }}</span>
        <el-tag v-if="false" style="float: right" type="text">{{ tag }}</el-tag>
      </div>
      <div style="font-size: 40px;color:#20A9D9 ;font-weight: 300">{{ content > 0 ? content.toLocaleString() :0}}</div>
      <div v-show="false" style="font-size: 10px; color: #B7B6B6">{{ footer }}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: ['title', 'tag', 'content', 'footer']
}
</script>

<style scoped>
.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
