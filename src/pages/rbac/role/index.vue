<template>
  <d2-container>
    <h1>角色管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色配置" name="role">
        <role-table></role-table>
      </el-tab-pane>
      <el-tab-pane label="角色资源配置" name="roleResource">
        <role-resource-master></role-resource-master>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import RoleTable from '../../../components/caesar/rbac/RoleTable'
import RoleResourceMaster from '../../../components/caesar/rbac/RoleResourceMaster'

export default {
  data () {
    return {
      activeName: 'role'
    }
  },
  mounted () {
  },
  components: {
    RoleTable,
    RoleResourceMaster
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
