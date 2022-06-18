<template>
  <el-transfer
    v-model="accountIds"
    :props="{ key: 'id', label: 'displayName' }"
    :data="accountOptions"
    :titles="['所有账户', '当前账户']">
  </el-transfer>
</template>

<script>
// API
import { QUERY_SERVER_ACCOUNT_PAGE, UPDATE_SERVER_ACCOUNT_PERMISSION } from '@/api/modules/server/server.account.api.js'
import tools from '@/libs/tools.js'
export default {
  data () {
    return {
      sourceAccountIds: [],
      accountIds: [],
      accountOptions: []
    }
  },
  name: 'ServerAccountTransfer',
  props: ['serverId'],
  mixins: [],
  mounted () {
  },
  methods: {
    init (accountIds) {
      this.sourceAccountIds = accountIds
      this.accountIds = accountIds
      this.getAccount('')
    },
    getAccount (name) {
      const parameter = {
        username: '',
        accountType: '',
        protocol: '',
        extend: true,
        page: 1,
        length: 100
      }
      QUERY_SERVER_ACCOUNT_PAGE(parameter)
        .then(res => {
          this.accountOptions = res.body.data
        })
    },
    save () {
      if (tools.arrayEquals(this.sourceAccountIds, this.accountIds)) return
      const requestBody = {
        serverId: this.serverId,
        accountIds: this.accountIds
      }
      UPDATE_SERVER_ACCOUNT_PERMISSION(requestBody)
        .then(res => {
        })
    }
  }
}
</script>

<style>

  .el-transfer-panel {
    width: 250px;
  }

</style>
