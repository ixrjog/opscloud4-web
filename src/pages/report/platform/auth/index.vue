<template>
  <d2-container>
    <h1>平台认证管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="认证日志" name="authLog">
        <platform-auth-log-table></platform-auth-log-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import PlatformAuthLogTable from '@/components/opscloud/report/platform/auth/PlatformAuthLogTable'

export default {
  data () {
    return {
      activeName: 'authLog'
    }
  },
  mounted () {
  },
  components: {
    PlatformAuthLogTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
