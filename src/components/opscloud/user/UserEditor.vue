<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName" @tab-click="handlerClick">
      <el-tab-pane label="基本信息" name="user">
        <user-info :operationType="formStatus.operationType" ref="userInfo" @close="handleClose"></user-info>
      </el-tab-pane>
      <el-tab-pane label="服务器授权" name="serverGroup" :disabled="user.id === '' || user.id === 0">
        <user-server-group-tab :user="user" ref="userServerGroupTab"></user-server-group-tab>
      </el-tab-pane>
      <el-tab-pane label="用户组授权" name="userGroup" :disabled="user.id === '' || user.id === 0">
        <user-group-tab :user="user" ref="userGroupTab"></user-group-tab>
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
    UserServerGroupTab
  },
  methods: {
    initData (user) {
      this.activeName = 'user'
      this.user = user
      this.$nextTick(() => {
        this.$refs.userInfo.initData(user)
      })
    },
    handlerClick () {
      switch (this.activeName) {
        case 'serverGroup':
          this.$refs.userServerGroupTab.init()
          break
        case 'userGroup':
          this.$refs.userGroupTab.init()
          break
      }
    },
    handleSave () {
      this.$refs.userInfo.save()
    },
    handleClose () {
      this.formStatus.visible = false
      this.$emit('close')
    }
  }
}
</script>
