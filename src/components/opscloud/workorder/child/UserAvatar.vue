<!--suppress HtmlUnknownTag -->
<template>
  <div class="userAvatar">
      <el-avatar v-if="user !== null && user.avatar !== null && user.avatar !== undefined"
                 :src="user.avatar" :size="size"/>
      <user-tag v-if="user !== null" :user="user"/>
  </div>
</template>

<script>
import UserTag from '@/components/opscloud/common/tag/UserTag'

export default {
  name: 'UserAvatar',
  props: ['user', 'size'],
  components: {
    UserTag
  }
}
</script>

<style lang="less" scoped>

.userAvatar {
  display: flex;
  .el-avatar {
    margin-right: 3px;
  }
}

</style>
