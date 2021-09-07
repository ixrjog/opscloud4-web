<template>
  <d2-container>
    <h1>剧本任务</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="批量任务" name="batchTask">
        <ansible-batch-task-table></ansible-batch-task-table>
      </el-tab-pane>
      <el-tab-pane label="剧本管理" name="playbook">
        <ansible-playbook-table></ansible-playbook-table>
      </el-tab-pane>

    </el-tabs>
  </d2-container>
</template>

<script>

import AnsiblePlaybookTable from '../../../components/opscloud/task/AnsiblePlaybookTable'
import AnsibleBatchTaskTable from '../../../components/opscloud/task/AnsibleBatchTaskTable'

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
    AnsiblePlaybookTable
  },
  methods: {}
}
</script>

<style scoped>

</style>
