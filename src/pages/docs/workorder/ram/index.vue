<template>
  <d2-container>
    <h1>帮助文档</h1>
    <document-zone mount-zone="WORKORDER_RAM"></document-zone>
  </d2-container>
</template>


<script>

import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'

export default {
  components: {
    DocumentZone
  }
}
</script>
