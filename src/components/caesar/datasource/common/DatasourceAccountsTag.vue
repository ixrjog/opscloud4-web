<template>
  <span class="tag-group">
    <span v-for="item in accounts" :key="item.id">
        <el-tag style="margin-left: 5px">{{ item.accountId }}<{{ item.displayName }}></el-tag>
    </span>
  </span>
</template>

<script>
export default {
  name: 'DatasourceAccountsTag',
  props: ['accounts']
}
</script>

<style scoped>

</style>
