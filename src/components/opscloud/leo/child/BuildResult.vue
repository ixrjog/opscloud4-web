<!--suppress HtmlUnknownTag -->
<template>
  <el-tag disable-transitions :type="build.buildResult | getBuildResultType">
    <i class="el-icon-loading" v-show="!build.isFinish"/>
    <span v-if="$i18n.locale === 'en'">{{ build.buildResult }}</span>
    <span v-if="$i18n.locale === 'zh-chs'">{{ build.buildResult | getBuildResultText }}</span>
    <el-popover placement="right" trigger="hover">
      <i class="el-icon-info" style="color: green; margin-left: 5px" slot="reference"/>
      <span style="font-size: 10px;color: #9d9fa3">{{ build.buildStatus === '' ? $t('common.noInformationAvailable') : build.buildStatus}}</span>
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
