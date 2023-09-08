<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>用户管理</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户" name="user">
        <user-table ref="userTable"/>
      </el-tab-pane>
      <el-tab-pane label="用户组" name="group">
        <user-group-table ref="userGroupTable"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import UserTable from '../../components/opscloud/user/UserTable'
import UserGroupTable from '../../components/opscloud/user/UserGroupTable'

export default {
  data () {
    return {
      activeName: 'user'
    }
  },
  mounted () {
  },
  components: {
    UserTable,
    UserGroupTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'group') {
        this.$nextTick(() => {
          this.$refs.userGroupTable.fetchData()
        }, 200)
      }
    }
  }
}
</script>

<style scoped>

</style>
