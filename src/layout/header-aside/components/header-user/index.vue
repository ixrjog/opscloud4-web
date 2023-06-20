<!--suppress HtmlUnknownTag -->
<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `Hi ${info.name}` : 'Not Logged In'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="fas fa-power-off" class="d2-mr-5"/>
        Logout
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
