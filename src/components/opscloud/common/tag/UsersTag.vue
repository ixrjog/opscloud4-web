<!--suppress HtmlUnknownTag -->
<template>
  <span class="tag-group">
    <span v-for="item in users" :key="item.id">
        <el-tag :type="item.userPermission.permissionRole | toPermissionRoleType" size="mini" style="margin-right: 5px">
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

import { toPermissionRoleType, toPermissionRoleText, toPermissionRoleClass } from '@/filters/user.permission.js'

export default {
  name: 'UsersTag',
  props: ['users'],
  filters: {
    toPermissionRoleType, toPermissionRoleText, toPermissionRoleClass
  },
  methods: {
    showName (user) {
      return (user.name === null || user.name === '' || user.name === user.displayName)
    }
  }
}
</script>

<style scoped>

.user {
  background-color: #179bb9;
  color: white;
  margin-left: 5px;
  margin-bottom: 5px;
}

.develop {
  background-color: #6512e0;
  color: white;
  margin-left: 5px;
  margin-bottom: 5px;
}

.qualityAssurance {
  background-color: #de6508;
  color: white;
  margin-left: 5px;
  margin-bottom: 5px;
}

.admin {
  background-color: #93060e;
  color: white;
  margin-left: 5px;
  margin-bottom: 5px;
}

</style>
