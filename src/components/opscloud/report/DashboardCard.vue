<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <el-tag style="float: right" type="text">{{ tag }}</el-tag>
    </div>
    <div style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ value }}</div>
    <div style="font-size: 10px; color: #B7B6B6">{{ valueDesc }}</div>
  </el-card>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: ['title', 'tag', 'value', 'valueDesc']
}
</script>

<style scoped>

>>>.el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

</style>
