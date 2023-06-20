<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>Leo模板管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="模板配置" name="template">
        <leo-template-table/>
      </el-tab-pane>
      <el-tab-pane label="帮助文档" name="docs">
        <document-zone mount-zone="LEO_MGMT"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import LeoTemplateTable from '@/components/opscloud/leo/LeoTemplateTable'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  name: 'leoTemplate',
  data() {
    return {
      activeName: 'template'
    }
  },
  mounted() {
  },
  components: {
    LeoTemplateTable,
    DocumentZone
  },
  methods: {}
}
</script>

<style scoped>

</style>
