<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible">
    <el-form>
      <el-transfer v-model="roleIds"
                   :props="{ key: 'id', label: 'roleName' }"
                   :data="roleOptions"
                   :titles="['所有标签', '当前标签']">
      </el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button type="primary" size="mini" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { QUERY_ROLE_PAGE } from '@/api/modules/auth/auth.role.api.js'
import { UPDATE_USER_ROLE } from '@/api/modules/auth/auth.user.role.api.js'

export default {
  name: 'UserRoleEditor',
  props: ['formStatus'],
  data () {
    return {
      user: '',
      roleIds: [],
      roleOptions: [],
      title: '用户角色绑定配置'
    }
  },
  mixins: [],
  mounted () {
    this.getRole()
  },
  methods: {
    getRole () {
      const requestBody = {
        roleName: '',
        page: 1,
        length: 50
      }
      QUERY_ROLE_PAGE(requestBody)
        .then(res => {
          this.roleOptions = res.body.data
        })
    },
    initData: function (user) {
      this.user = user
      this.roleIds = user.roles.map((item) => item.id)
    },
    handlerSave () {
      const requestBody = {
        username: this.user.username,
        roleIds: this.roleIds
      }
      UPDATE_USER_ROLE(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>

<style scoped>

</style>
