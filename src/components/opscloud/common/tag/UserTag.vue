<!--suppress HtmlUnknownTag -->
<template>
  <el-tag size="mini">
    <span v-if="showName(user)">
      {{ user.username }}&lt;{{ user.displayName }}&gt;
    </span>
    <span v-else>
      {{ user.username }}&lt;{{ user.name }}:{{ user.displayName }}&gt;
    </span>
  </el-tag>
</template>

<script>
export default {
  name: 'UserTag',
  props: ['user'],
  methods: {
    showName (user) {
      return (user.name === null || user.name === '' || user.name === user.displayName)
    },
    tagColor (user) {
      if (user.userPermission?.permissionRole && user.userPermission.permissionRole === 'admin') {
        return 'danger'
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
