<!--suppress HtmlUnknownTag -->
<template>
  <el-alert style="background-color: #91040b; margin-top: 10px" :closable="false">
    <div style="color: #FFFFFF">
      <i class="fas fa-exclamation-triangle" style="margin-right: 1px"/>
      <b>{{ $t('leo.build.riskReminder') }}</b>
      <br/>
      <span style="color: #d9d9d9">{{ $t('leo.build.branchLagging') }} Master {{ compareResults.commits.length }} Commits</span>
    </div>
    <el-divider/>
    <el-checkbox v-model="ignoreAlarms" @change="handleIgnoreAlarms">
      <span style="margin-left: 2px; color: #ffffff; font-size: 12px">{{ $t('leo.build.ignoreAlarms') }}</span>
    </el-checkbox>
  </el-alert>
</template>

<script>

import tools from '@/libs/tools'

export default {
  // 构建风控告警
  name: 'BuildRiskWarning',
  props: {
    compareResults: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ignoreAlarms: false
    }
  },
  methods: {
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
    },
    handleIgnoreAlarms () {
      this.$emit('handleIgnoreAlarms', this.ignoreAlarms)
    }
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  margin: 1px 0;
}

</style>
