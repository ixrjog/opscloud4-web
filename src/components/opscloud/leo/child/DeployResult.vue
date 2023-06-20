<!--suppress HtmlUnknownTag -->
<template>
  <el-tag disable-transitions :type="deploy.deployResult|getBuildResultType" size="mini">
    <i class="el-icon-loading" v-show="!deploy.isFinish"></i>{{ deploy.deployResult|getBuildResultText }}
    <el-popover placement="right" trigger="hover">
      <i class="el-icon-info" style="color: green; margin-left: 5px" slot="reference"/>
      <span style="font-size: 10px;color: #9d9fa3">{{deploy.deployStatus === '' ? '无可用信息' : deploy.deployStatus}}</span>
    </el-popover>
  </el-tag>
</template>

<script>

// Filters
import { getBuildResultType, getBuildResultText } from '@/filters/leo.build.result.js'

export default {
  name: 'DeployResult',
  props: ['deploy'],
  filters: {
    getBuildResultType,
    getBuildResultText
  }
}
</script>

<style scoped>

</style>
