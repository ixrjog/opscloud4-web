<template>
<!--    <el-tooltip class="item" effect="light" :content="build.buildResult !== null? build.buildResult: 'RUNNING'"-->
<!--                placement="top-start">-->
<!--      <el-tag disable-transitions :type="build.buildResult | getBuildResultType ">-->
<!--        <i class="el-icon-loading" v-show="!build.isFinish"></i>{{build.buildResult|getBuildResultText}}-->
<!--      </el-tag>-->
<!--    </el-tooltip>-->
  <el-tag disable-transitions :type="build.buildResult | getBuildResultType ">
    <i class="el-icon-loading" v-show="!build.isFinish"></i>{{build.buildResult|getBuildResultText}}
    <el-popover placement="right" trigger="hover">
      <i class="el-icon-info" style="color: green; margin-left: 5px" slot="reference"></i>
      <span style="font-size: 10px;color: #9d9fa3">{{ build.buildStatus === '' ? '无可用信息' : build.buildStatus}}</span>
    </el-popover>
  </el-tag>
</template>

<script>

// Filters
import { getBuildResultType, getBuildResultText } from '@/filters/leo.build.result.js'

export default {
  name: 'BuildResult',
  props: ['build'],
  filters: {
    getBuildResultType,
    getBuildResultText
  }
}
</script>

<style scoped>

</style>
