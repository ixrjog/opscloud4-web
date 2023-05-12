<template>
  <span class="tag-group">
    <span v-for="item in users" :key="item.id">
        <el-tag style="margin-left: 5px;margin-bottom: 5px"
                :type="item.userPermission.permissionRole | toPermissionRoleType" size="mini">
          <span v-if="showName(item)">
            {{ item.username }}&lt;{{ item.displayName }}&gt;
          </span>
          <span v-else>
            {{ item.username }}&lt;{{ item.name }}:{{ item.displayName }}&gt;
          </span>
        </el-tag>
    </span>
  </span>
</template>

<script>

import { toPermissionRoleType, toPermissionRoleText } from '@/filters/user.permission.js'

export default {
  name: 'UsersTag',
  props: ['users'],
  filters: {
    toPermissionRoleType, toPermissionRoleText
  },
  methods: {
    showName (user) {
      return (user.name === null || user.name === '' || user.name === user.displayName)
    }
    // tagColor (user) {
    //   if (user.userPermission?.permissionRole && user.userPermission.permissionRole === 'admin') {
    //     return 'danger'
    //   }
    //   return ''
    // }
  }
}
</script>

<style scoped>

</style>
