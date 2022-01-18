<template>
  <div style="margin: auto">
    <el-avatar v-if="user !== null && user.avatar !== null && user.avatar !== undefined"
               :src="user.avatar" :size="size"></el-avatar>
    <user-tag v-if="user !== null" :user="user"></user-tag>
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

<style scoped>

</style>
