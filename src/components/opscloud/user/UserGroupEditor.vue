<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="userGroup">
        <user-group-info :operationType="formStatus.operationType" ref="userGroupInfo"
                         @close="handleClose"></user-group-info>
      </el-tab-pane>
      <el-tab-pane label="用户授权" name="permissionUser" :disabled="JSON.stringify(userGroup) == '{}'">
        <permission-user-tab :businessType="businessType" :businessId="userGroup.id"
                             ref="permissionUserTab"></permission-user-tab>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import UserGroupInfo from './child/UserGroupInfo'
import PermissionUserTab from './child/BusinessPermissionUserTab'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'

export default {
  data () {
    return {
      activeName: 'userGroup',
      userGroup: {},
      labelWidth: '150px',
      businessType: BusinessType.USERGROUP
    }
  },
  name: 'UserGroupEditor',
  props: ['formStatus'],
  mounted () {
  },
  components: {
    UserGroupInfo,
    PermissionUserTab
  },
  methods: {
    initData (userGroup) {
      this.activeName = 'userGroup'
      this.userGroup = userGroup
      this.$nextTick(() => {
        this.$refs.userGroupInfo.initData(userGroup)
      })
    },
    handleClick () {
      if (this.activeName === 'permissionUser') this.$refs.permissionUserTab.init()
    },
    handleSave () {
      this.$refs.userGroupInfo.save()
    },
    handleClose () {
      this.formStatus.visible = false
      this.$emit('close')
    }
  }
}
</script>
