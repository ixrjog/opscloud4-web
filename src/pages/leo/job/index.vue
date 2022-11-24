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
    </el-tabs>
  </d2-container>
</template>

<script>

import LeoJobTable from '@/components/opscloud/leo/LeoJobTable'
import LeoBuildTable from '@/components/opscloud/leo/LeoBuildTable'

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
    LeoBuildTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
