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
        <d2-highlight v-if="editing" class="content" :code="menuContent" lang="json"></d2-highlight>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveAuthRoleMenu" :loading="loading">保存</el-button>
      <el-button type="primary" @click="formStatus.visible = false">关闭</el-button>
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
      menuContent: '',
      loading: false,
      editing: false
    }
  },
  name: 'RoleMenuEditor',
  props: ['formStatus'],
  components: {},
  mounted () {
    this.fetchData()
  },
  methods: {
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
      this.loading = true
      SAVE_AUTH_ROLE_MENU(param)
        .then(() => {
          this.$message.success('保存成功')
          this.getAuthRoleMenuDetail()
        }).catch(() => {
          this.loading = false
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
      this.editing = false
      QUERY_AUTH_ROLE_MENU_DETAIL({ roleId: this.roleId })
        .then(({ body }) => {
          this.menuContent = JSON.stringify(body, null, 4)
          this.editing = true
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

.content {
  margin-top: 5px;
  font-size: 10px;
  background-color: #dad8c8;
  line-height: 110%;
  height: 600px;
}

</style>
