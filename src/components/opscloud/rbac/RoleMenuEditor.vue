<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible">
    <el-row style="margin-bottom: 10px">
      <el-form label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleName" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree :data="menuOptions" show-checkbox node-key="value" ref="menuTree"></el-tree>
      </el-col>
      <el-col :span="18">
        <editor v-model="menuContent" @init="editorInit" lang="json" theme="kuroir"
                width="100%" height="600" disabled=""></editor>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveAuthRoleMenu">确定</el-button>
      <el-button type="primary" @click="getAuthRoleMenuDetail">预览</el-button>
    </div>
  </el-dialog>
</template>

<script>

import {
  QUERY_AUTH_ROLE_MENU,
  QUERY_AUTH_ROLE_MENU_DETAIL,
  QUERY_MENU_TREE,
  SAVE_AUTH_ROLE_MENU
} from '@/api/modules/sys/sys.menu.api'

export default {
  data () {
    return {
      title: '角色菜单配置',
      submenuIdList: [],
      menuOptions: [],
      menuCascaderProps: {
        multiple: true,
        expandTrigger: 'hover'
      },
      roleId: '',
      roleName: '',
      menuContent: ''
    }
  },
  name: 'RoleMenuEditor',
  props: ['formStatus'],
  components: {
    editor: require('vue2-ace-editor')
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    editorInit: function (ed) {
      require('brace/ext/language_tools')
      require('brace/mode/json')
      require('brace/mode/ejs')
      require('brace/theme/kuroir')
      ed.setReadOnly(true)
    },
    fetchData () {
      QUERY_MENU_TREE()
        .then(({ body }) => {
          this.menuOptions = body
        })
    },
    saveAuthRoleMenu () {
      const menuChildIdList = []
      for (const menuChildId of this.$refs.menuTree.getCheckedKeys()) {
        if (menuChildId > 0) {
          menuChildIdList.push(menuChildId)
        }
      }
      const param = {
        roleId: this.roleId,
        menuChildIdList: menuChildIdList
      }
      SAVE_AUTH_ROLE_MENU(param)
        .then(() => {
          this.$message.success('保存成功')
        })
    },
    initData (role) {
      this.menuContent = ''
      this.roleName = role.roleName
      this.roleId = role.id
      QUERY_AUTH_ROLE_MENU({ roleId: this.roleId })
        .then(({ body }) => {
          const menuChildIdList = []
          for (const authRoleMenu of body) {
            menuChildIdList.push(authRoleMenu.menuChildId)
          }
          this.$refs.menuTree.setCheckedKeys(menuChildIdList)
        })
      this.getAuthRoleMenuDetail()
    },
    getAuthRoleMenuDetail () {
      QUERY_AUTH_ROLE_MENU_DETAIL({ roleId: this.roleId })
        .then(({ body }) => {
          this.menuContent = JSON.stringify(body, null, 4)
        })
    }
  }
}
</script>

<style scoped>
</style>
