<template>
  <d2-container>
    <h1>剧本任务</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="批量任务" name="batchTask">
        <ansible-batch-task-table ref="ansbileBatchTaskTable"></ansible-batch-task-table>
      </el-tab-pane>
      <el-tab-pane label="任务详情" name="serverTask">
        <server-task-table ref="serverTaskTable"></server-task-table>
      </el-tab-pane>
      <el-tab-pane label="剧本管理" name="playbook">
        <ansible-playbook-table ref="ansiblePlaybookTable"></ansible-playbook-table>
      </el-tab-pane>

    </el-tabs>
  </d2-container>
</template>

<script>

import AnsiblePlaybookTable from '../../../components/opscloud/task/AnsiblePlaybookTable'
import AnsibleBatchTaskTable from '../../../components/opscloud/task/AnsibleBatchTaskTable'
import ServerTaskTable from '../../../components/opscloud/task/ServerTaskTable'

export default {
  data () {
    return {
      activeName: 'batchTask'
    }
  },
  mounted () {
  },
  components: {
    AnsibleBatchTaskTable,
    ServerTaskTable,
    AnsiblePlaybookTable
  },
  methods: {
    handleClick (tab, event) {
      // if (tab.name === 'batchTask') {
      //   this.$refs.ansbileBatchTaskTable.fetchData()
      //   return
      // }
      if (tab.name === 'serverTask') {
        this.$refs.serverTaskTable.fetchData()
        return
      }
      if (tab.name === 'playbook') {
        this.$refs.ansiblePlaybookTable.fetchData()
        return
      }
    }
  }
}
</script>

<style scoped>

</style>
