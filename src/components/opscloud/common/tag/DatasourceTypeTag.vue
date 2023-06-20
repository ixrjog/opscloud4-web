<!--suppress HtmlUnknownTag -->
<template>
  <el-tag size="mini">{{ dsTypeOptions.find(e=> e.value === dsType).label }}</el-tag>
</template>

<script>

export default {
  name: 'DatasourceTypeTag',
  props: ['dsType', 'dsTypeOptions']
}
</script>

<style scoped>

</style>
