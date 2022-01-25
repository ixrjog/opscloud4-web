<template>
  <span class="tag-group">
    <span v-for="item in users" :key="item.id">
        <el-tag style="margin-left: 5px" :type="tagColor(item)">
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
export default {
  name: 'UsersTag',
  props: ['users'],
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
