<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>资源管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="资源" name="resource">
        <resource-table/>
      </el-tab-pane>
      <el-tab-pane label="资源组" name="resourceGroup">
        <group-table/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import ResourceTable from '../../../components/opscloud/rbac/ResourceTable'
import GroupTable from '../../../components/opscloud/rbac/GroupTable'

export default {
  data () {
    return {
      activeName: 'resource'
    }
  },
  mounted () {
  },
  components: {
    ResourceTable,
    GroupTable
  },
  methods: {}
}
</script>

<style scoped>

</style>
