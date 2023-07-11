<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>Leo任务管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="任务配置" name="job">
        <leo-job-table/>
      </el-tab-pane>
      <el-tab-pane label="构建详情" name="build">
        <leo-build-table/>
      </el-tab-pane>
      <el-tab-pane label="部署详情" name="deploy">
        <leo-deploy-table/>
      </el-tab-pane>
      <el-tab-pane label="配置工具" name="tools">
        <leo-job-clone-tools/>
        <div style="height: 5px"/>
        <leo-job-one-clone-tools/>
      </el-tab-pane>
      <el-tab-pane label="帮助文档" name="docs">
        <document-zone mount-zone="LEO_MGMT"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import LeoJobTable from '@/components/opscloud/leo/LeoJobTable'
import LeoBuildTable from '@/components/opscloud/leo/LeoBuildTable'
import LeoDeployTable from '@/components/opscloud/leo/LeoDeployTable.vue'
import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'
import LeoJobCloneTools from '@/components/opscloud/leo/LeoJobCloneTools.vue'
import LeoJobOneCloneTools from '@/components/opscloud/leo/LeoJobOneCloneTools.vue'

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
    LeoJobCloneTools,
    LeoJobOneCloneTools,
    DocumentZone
  },
  methods: {}
}
</script>

<style scoped>

</style>
