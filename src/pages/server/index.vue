<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('server.server')" name="server">
        <server-table/>
      </el-tab-pane>
      <el-tab-pane :label="$t('server.serverAccount')" name="account">
        <server-account-table/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import ServerAccountTable from '../../components/opscloud/server/ServerAccountTable'
import ServerTable from '../../components/opscloud/server/ServerTable'

export default {
  name: 'server',
  data () {
    return {
      activeName: 'server'
    }
  },
  mounted () {
  },
  components: {
    ServerTable,
    ServerAccountTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
