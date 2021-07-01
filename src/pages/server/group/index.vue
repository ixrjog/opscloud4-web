<template>
  <d2-container>
    <h1>服务器组管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="服务器组" name="group">
        <server-group-table></server-group-table>
      </el-tab-pane>
      <el-tab-pane label="服务器组类型" name="groupType">
        <server-group-type-table></server-group-type-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import ServerGroupTypeTable from '../../../components/opscloud/server/ServerGroupTypeTable'
import ServerGroupTable from '../../../components/opscloud/server/ServerGroupTable'

export default {
  data () {
    return {
      activeName: 'group'
    }
  },
  mounted () {
  },
  components: {
    ServerGroupTable,
    ServerGroupTypeTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
