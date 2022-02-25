<template>
  <el-tag size="mini">{{ kinds.find(e => e.value === kind).label }}</el-tag>
</template>

<script>
export default {
  name: 'CredentialKindTag',
  props: ['kinds', 'kind'],
  mounted () {
  }
}
</script>

<style scoped>

</style>
