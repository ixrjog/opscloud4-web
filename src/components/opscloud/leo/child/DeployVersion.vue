<template>
  <div style="margin-bottom: 10px">
    <el-tag>
      <b style="font-size: 15px">{{ version.versionName }}</b>
      <span v-if="type === 'release'" style="font-size: 12px; margin-left: 15px">副本数 {{ version.pods.length }}/{{ replicas }}</span>
    </el-tag>
    <span style="margin-left: 15px; font-size: 12px"><i class="fab fa-centos"></i>{{ version.image }}</span>
  </div>
</template>

<script>
export default {
  name: 'DeployVersion',
  props: ['version','type','replicas']
}
</script>

<style scoped>

</style>
