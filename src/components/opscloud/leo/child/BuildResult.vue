<!--suppress HtmlUnknownTag -->
<template>
  <span>
    <i class="el-icon-loading" v-show="!build.isFinish"/>
    <span v-if="$i18n.locale === 'en'" :class="build.buildResult">{{ build.buildResult }}</span>
    <span v-if="$i18n.locale === 'zh-chs'" :class="build.buildResult">{{ build.buildResult | getBuildResultText }}</span>
    <el-popover placement="right" trigger="hover">
      <i class="el-icon-info" style="color: green; margin-left: 5px" slot="reference"/>
      <span>{{ build.buildStatus === '' ? $t('common.noInformationAvailable') : build.buildStatus }}</span>
    </el-popover>
  </span>
</template>

<script>

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

.SUCCESS {
  color: #03a25b;
}

.FAILURE {
  color: #c9171f;
}

.UNSTABLE {
  color: #e56c0d;
}

.REBUILDING {
  color: #0cb3cb;
}

.BUILDING {
  color: #0cb3cb;
}

.ABORTED {
  color: #e56c0d;
}

.UNKNOWN {
  color: #e56c0d;
}

.NOT_BUILT {
  color: rgba(255, 255, 255, 0.3);
}

.CANCELLED {
  color: #c9171f;
}

.ERROR {
  color: #c9171f;
}

</style>
