<template>
    <el-tooltip class="item" effect="light" :content="build.buildResult !== null? build.buildResult: 'RUNNING'"
                placement="top-start">
      <el-tag disable-transitions :type="build.buildResult | getBuildResultType ">
        <i class="el-icon-loading" v-show="!build.isFinish"></i>{{build.buildResult|getBuildResultText}}
      </el-tag>
    </el-tooltip>
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
