<template>
  <d2-container>
    <h1>用户管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null">
      <el-tab-pane label="账户" name="account">
        <account-table :instanceId="instanceId"></account-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>


import AccountTable from '../../../../components/caesar/datasource/account/AccountTable'

export default {
  data () {
    return {
      activeName: 'account',
      instanceId: null
    }
  },
  computed: {},
  mounted () {
    this.instanceId = this.$route.query.id
    this.activeName = 'account'
  },
  components: {
    AccountTable
  },
  methods: {}
}
</script>

<style scoped>
  .el-input {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .el-select {
    margin-left: 5px;
  }

  .el-button {
    margin-left: 5px;
  }

  >>> .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
