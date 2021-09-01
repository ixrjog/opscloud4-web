<template>
  <d2-container>
    <h1>剧本任务</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="剧本管理" name="playbook">
        <ansible-playbook-table></ansible-playbook-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import AnsiblePlaybookTable from '../../../components/opscloud/task/AnsiblePlaybookTable'

export default {
  data () {
    return {
      activeName: 'playbook'
    }
  },
  mounted () {
  },
  components: {
    AnsiblePlaybookTable
  },
  methods: {}
}
</script>

<style scoped>

</style>
