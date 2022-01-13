<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="handleClose">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="user">
        <user-info :operationType="formStatus.operationType" ref="userInfo" @close="handleClose"
                   @refreshData="refreshData"></user-info>
      </el-tab-pane>
      <el-tab-pane label="服务器授权" name="serverGroup" :disabled="user.id === '' || user.id === 0">
        <user-server-group-tab :user="user" ref="userServerGroupTab"></user-server-group-tab>
      </el-tab-pane>
      <el-tab-pane label="用户组授权" name="userGroup" :disabled="user.id === '' || user.id === 0">
        <user-group-tab :user="user" ref="userGroupTab"></user-group-tab>
      </el-tab-pane>
      <el-tab-pane label="RAM授权" name="ram" :disabled="user.id === '' || user.id === 0">
        <ram-tab :user="user" ref="ramTab"></ram-tab>
      </el-tab-pane>
      <el-tab-pane label="角色授权" name="role" :disabled="user.id === '' || user.id === 0">
        <role-tab :user="user" ref="roleTab"></role-tab>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import UserServerGroupTab from './child/UserServerGroupTab'
import UserGroupTab from './child/UserGroupTab'
import UserInfo from './child/UserInfo'
import RamTab from '@/components/opscloud/user/child/RamTab'
import RoleTab from '@/components/opscloud/user/child/RoleTab'

export default {
  data () {
    return {
      activeName: 'user',
      user: '',
      password: '',
      labelWidth: '150px'
    }
  },
  name: 'UserEditor',
  props: ['formStatus'],
  mounted () {
  },
  components: {
    UserInfo,
    UserGroupTab,
    UserServerGroupTab,
    RamTab,
    RoleTab
  },
  methods: {
    initData (user) {
      this.activeName = 'user'
      this.user = Object.assign({}, user)
      this.$nextTick(() => {
        this.$refs.userInfo.initData(user)
      })
    },
    handleClick (tab, event) {
      if (tab.name === 'serverGroup') {
        this.$refs.userServerGroupTab.init()
        return
      }
      if (tab.name === 'userGroup') {
        this.$refs.userGroupTab.init()
        return
      }
      if (tab.name === 'ram') {
        this.$refs.ramTab.init()
        return
      }
      if (tab.name === 'role') {
        this.$refs.roleTab.init()
      }
    },
    handleSave () {
      this.$refs.userInfo.save()
    },
    handleClose () {
      this.formStatus.visible = false
      this.$emit('close')
    },
    refreshData (user) {
      this.initData(user)
      this.formStatus.operationType = false
    }
  }
}
</script>
