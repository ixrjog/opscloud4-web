<!--suppress HtmlUnknownTag -->
<template>
  <el-tag size="mini">
    {{ user.username }}&lt;<span v-if="user.name !== null && user.name !== '' && user.name !== user.displayName">{{
      user.name
    }}:</span>{{ user.displayName }}&gt;
  </el-tag>
</template>

<script>
export default {
  name: 'UserTag',
  props: ['user'],
  methods: {}
}
</script>

<style scoped>

</style>
