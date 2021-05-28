<template>
  <d2-container>
    <h1>用户管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户" name="user">
        <user-table></user-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import UserTable from '../../components/caesar/user/UserTable'

export default {
  data () {
    return {
      activeName: 'user'
    }
  },
  mounted () {
  },
  components: {
    UserTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
