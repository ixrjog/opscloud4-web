<template>
  <div>
    <el-form>
      <el-transfer v-model="roleIds"
                   :props="{ key: 'id', label: 'roleName' }"
                   :data="roleOptions"
                   :titles="['所有标签', '当前标签']"
                   @change="handlerSave">
      </el-transfer>
    </el-form>
  </div>
</template>

<script>

import { QUERY_ROLE_PAGE } from '@/api/modules/auth/auth.role.api.js'
import { UPDATE_USER_ROLE } from '@/api/modules/auth/auth.user.role.api.js'

export default {
  name: 'UserRoleEditor',
  props: ['user'],
  data () {
    return {
      roleIds: [],
      roleOptions: [],
      title: '用户角色绑定配置'
    }
  },
  mixins: [],
  mounted () {
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
    init () {
      this.getRole()
      this.roleIds = this.user.roles.map((item) => item.id)
    },
    handlerSave () {
      const requestBody = {
        username: this.user.username,
        roleIds: this.roleIds
      }
      UPDATE_USER_ROLE(requestBody)
        .then(res => {
          this.$message.success('成功')
        })
    }
  }
}
</script>

<style scoped>

</style>
