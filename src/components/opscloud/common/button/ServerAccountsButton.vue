<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <span v-for="item in server.accounts" :key="item.id">
      <el-button type="primary" plain size="mini" @click="handleRemote(item)" style="margin: 0 5px 5px 0"
                 v-if="item.protocol!== 'ssh'">
        <i class="fas fa-desktop" aria-hidden="true" v-show="item.protocol=== 'vnc'"/>
        <i class="fab fa-windows" aria-hidden="true" v-show="item.protocol=== 'rdp'"/>
        <span style="margin-left: 2px">{{ item.username }}</span>
      </el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ServerAccountsButton',
  props: ['server'],
  methods: {
    handleRemote (account) {
      const removeServer = {
        params: {
          serverId: this.server.id,
          serverAccountId: account.id,
          protocol: account.protocol
        },
        server: this.server,
        serverAccount: account
      }
      this.$emit('handleRemote', removeServer)
    }
  }
}
</script>

<style scoped>

</style>
