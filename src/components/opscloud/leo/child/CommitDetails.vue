<!--suppress HtmlUnknownTag -->
<template>
  <el-alert v-show="JSON.stringify(branch) !== '{}'" style="background-color: #e56c0d"
            :closable="false">
    <a target="blank" :href="branch.commitWebUrl" style="color: #FFFFFF">
      <i class="fab fa-git-alt" style="margin-right: 1px"/>
      <b>{{ branch.commitId }}</b>
    </a>
    <div style="color: #d9d9d9">{{ branch.commitMessage }}</div>
    <el-divider/>
    <div style="color: #FFFFFF; float: right; font-size: 10px">
      {{ branch.authorName }} {{ branch.authorEmail }} {{ $t('leo.build.committed') }} {{ branch.authoredDate }} [
      {{ i18nAgo(branch.ago) }} ]
    </div>
  </el-alert>
</template>

<script>

import tools from '@/libs/tools'

export default {
  name: 'CommitDetails',
  props: {
    branch: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
    }
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  margin: 1px 0;
}

</style>
