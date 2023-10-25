<!--suppress HtmlUnknownTag -->
<template>
  <el-card shadow="never" class="banner">
    <el-tag type="success" @click="openUrl(application.armsTraceApp.homeUrl)">
      {{ $t('arms.name') }}
      <i class="fas fa-external-link-alt" style="margin-left: 2px"/>
    </el-tag>
  </el-card>
</template>

<script>

export default {
  name: 'ArmsBanner',
  props: ['application'],
  methods: {
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>
