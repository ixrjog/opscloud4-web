<template>
  <el-tooltip class="item" effect="light" :content="deploy.deployResult !== null? deploy.deployResult: 'RUNNING'"
              placement="top-start">
    <el-tag disable-transitions :type="deploy.deployResult | getBuildResultType " size="mini">
      <i class="el-icon-loading" v-show="!deploy.isFinish"></i>{{deploy.deployResult|getBuildResultText}}
    </el-tag>
  </el-tooltip>
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
