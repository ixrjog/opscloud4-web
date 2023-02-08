<template>
  <d2-container>
    <h1>Leo任务管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="任务配置" name="job">
        <leo-job-table></leo-job-table>
      </el-tab-pane>
      <el-tab-pane label="构建详情" name="build">
        <leo-build-table></leo-build-table>
      </el-tab-pane>
      <el-tab-pane label="部署详情" name="deploy">
        <leo-deploy-table></leo-deploy-table>
      </el-tab-pane>
      <el-tab-pane label="配置工具" name="tools">
        <leo-job-tools-page></leo-job-tools-page>
      </el-tab-pane>
      <el-tab-pane label="帮助文档" name="docs">
        <document-zone mount-zone="LEO"></document-zone>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import LeoJobTable from '@/components/opscloud/leo/LeoJobTable'
import LeoBuildTable from '@/components/opscloud/leo/LeoBuildTable'
import LeoDeployTable from '@/components/opscloud/leo/LeoDeployTable.vue'
import LeoJobToolsPage from '@/components/opscloud/leo/LeoJobToolsPage.vue'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  name: 'leoJob',
  data () {
    return {
      activeName: 'job'
    }
  },
  mounted () {
  },
  components: {
    LeoJobTable,
    LeoBuildTable,
    LeoDeployTable,
    LeoJobToolsPage,
    DocumentZone
  },
  methods: {}
}
</script>

<style scoped>

</style>
